import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      //   toast.success("Medication reminder saved and logged.");
    },
    onError: (error) => console.error(`Error: ${error.message}`),
  });
};
