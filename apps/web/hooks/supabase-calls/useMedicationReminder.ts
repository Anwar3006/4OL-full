import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Pagination = {
  limit: number;
  page: number;
  search?: string;
  isEnabled?: boolean;
};

export const useMedicationReminders = ({
  limit,
  page,
  search,
  isEnabled,
}: Pagination) => {
  return useQuery<any, Error>({
    queryKey: ["medication-reminders"],
    queryFn: async () => {
      const query = supabase.from("medication_reminders").select("*");

      const from = (page - 1) * limit;
      const to = limit + from - 1;

      if (search && search.trim() !== "") {
        query.or(`
            medication_name.ilike.%${search}%
        `);
      }

      if (isEnabled) {
        query.eq("is_enabled", isEnabled);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return data;
    },
  });
};

//======================= Mutations

// 1. Hook to Upsert (Create or Update)
export const useUpsertMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adminId,
      reminderId,
      values,
    }: {
      adminId: string;
      reminderId: string | null;
      values: any;
    }) => {
      const { data, error } = await supabase.rpc(
        "admin_upsert_medication_reminder",
        {
          p_admin_id: adminId,
          p_reminder_id: reminderId,
          p_payload: values,
        },
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication-reminders"] });
      toast.success("Medication reminder saved and logged.");
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });
};

// 2. Hook to Delete
export const useDeleteMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adminId,
      reminderId,
    }: {
      adminId: string;
      reminderId: string;
    }) => {
      const { error } = await supabase.rpc("admin_delete_medication_reminder", {
        p_admin_id: adminId,
        p_reminder_id: reminderId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication-reminders"] });
      toast.success("Reminder deleted and audit log updated.");
    },
  });
};
