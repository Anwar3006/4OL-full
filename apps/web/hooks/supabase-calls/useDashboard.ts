import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardStats = () => {
  return useQuery<any, Error>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_dashboard_metrics")
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });
};
