import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export type ConditionFilter = {
  categoryId?: string;
  letter?: string;
  searchTerm?: string;
};

export const useConditions = (filter: ConditionFilter) => {
  return useQuery({
    // The queryKey becomes a dependency array for your filters
    queryKey: ["conditions", filter],
    queryFn: async () => {
      const { categoryId, letter, searchTerm } = filter;

      // Start the query builder
      let query = supabase.from("conditions").select("*");

      // 1. Handle Many-to-Many Category Filter
      if (categoryId) {
        const { data, error } = await supabase
          .from("condition_categories")
          .select("conditions(*)")
          .eq("category_id", categoryId)
          .order("conditions(name)", { ascending: true });

        if (error) throw error;
        return data.map((item) => item.conditions).filter(Boolean);
      }

      // 2. Handle Alphabet Filter (Starts With)
      if (letter) {
        query = query.ilike("name", `${letter}%`);
      }

      // 3. Handle Global Search Filter
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
        );
      }

      const { data, error } = await query.order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    // Only run if at least one filter is active
    enabled: !!(filter.categoryId || filter.letter || filter.searchTerm),
  });
};
