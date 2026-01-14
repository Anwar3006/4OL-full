import { supabase } from "@/lib/supabase";
import { TConditionsOutput } from "@4ol/db/schemas/conditions.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Pagination {
  limit: number;
  page: number;
  search: string;
}

interface PaginatedResponse {
  data: TConditionsOutput[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  analytics: {};
}

export const CONDITIONS_QUERY_KEYS = {
  all: ["conditions"] as const,
  lists: () => [...CONDITIONS_QUERY_KEYS.all, "lists"] as const,
  list: (params: Pagination) =>
    [...CONDITIONS_QUERY_KEYS.lists(), { ...params }] as const,
  details: () => [...CONDITIONS_QUERY_KEYS.all, "details"] as const,
  detail: (id: string) => [...CONDITIONS_QUERY_KEYS.details(), id] as const,
};

//TODO: Finish all these hooks
export const useConditions = ({
  params,
  enabled,
}: {
  params: Pagination;
  enabled: boolean;
}) => {
  return useQuery<any, Error>({
    queryKey: CONDITIONS_QUERY_KEYS.all,
    queryFn: async () => {
      try {
        const { limit, page, search } = params;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const query = supabase
          .from("conditions")
          .select(
            "*, condition_types (type_name, about_type), condition_causes (cause_name, other_possible_causes), condition_categories (name), condition_body_parts (name)",
            { count: "exact" }
          );

        if (search) {
          query.or(`name.ilike.%${search}%`);
        }

        const { data, count, error } = await query.range(from, to);
        if (error) throw error;

        const totalCount = count ?? 0;
        return {
          data,
          meta: {
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
          },
        };
      } catch (error) {
        console.error("Error fetching conditions: ", error);
      }
    },
    enabled: enabled,
  });
};

//======================= Mutation Hooks ===============

export const useCreateCondition = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({});
};

export const useUpdateCondition = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({});
};

export const useDeleteCondition = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (id: string) => {
      await Promise.all([
        supabase.from("conditions").delete().eq("id", id),

        supabase.from("condition_body_parts").delete().eq("condition_id", id),
        supabase.from("condition_categories").delete().eq("condition_id", id),

        supabase.from("condition_causes").delete().eq("condition_id", id),
        supabase.from("condition_types").delete().eq("condition_id", id),
      ]);
    },
    onSuccess: () => {
      toast.success("Condtion successfully deleted!");
      queryClient.invalidateQueries({ queryKey: CONDITIONS_QUERY_KEYS.all });
    },
    onError: (error) => {
      toast.error("Error deleting condition: " + error.message);
    },
  });
};
