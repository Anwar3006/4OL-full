import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useConditionCategories = () => {
  return useQuery({
    queryKey: ["condition-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      console.log("Data: ", data);

      if (error) throw error;

      // 1. Create a Map for O(1) lookups during nesting
      const categoryMap: Record<string, any> = {};
      data.forEach((item) => {
        categoryMap[item.id] = { ...item, children: [] };
      });

      // 2. Use reduce as an accumulator to build the tree
      return data.reduce((acc: any[], item) => {
        const node = categoryMap[item.id];

        if (item.parent_id === null) {
          // It's a root category
          acc.push(node);
        } else {
          // Senior Tip: If the parent isn't in the list,
          // treat this as a root node so it doesn't disappear from the UI
          acc.push(node);
        }
        return acc;
      }, []);
    },
    // Since categories rarely change, set high staleTime/gcTime
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
};
