import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

// 2. Hook to fetch Drug for AutoComplete from RxNorm
export const useGetRxNorm = (query: string) => {
  return useQuery({
    queryKey: ["drug-search", query],
    queryFn: async () => {
      if (query.length < 3) return [];
      // Calling RxNav API for autocomplete
      const response = await fetch(
        `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${query}`,
      );
      const data = await response.json();
      return data.suggestionGroup.suggestionList.suggestion || [];
    },
    enabled: query.length > 2,
  });
};
