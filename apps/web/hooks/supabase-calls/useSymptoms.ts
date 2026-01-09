import { supabase } from "@/lib/supabase";
import {
  TSymptomsInput,
  TSymptomsOutput,
} from "@4ol/db/schemas/conditions.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Pagination = {
  page: number;
  limit: number;
};

interface PaginatedResponse {
  symptoms: TSymptomsOutput[];
  meta: {
    totalPages: number;
    total: number;
    currentPage: number;
  };
  analytics: {
    mostAffectedBodyParts: any[];
    totalCategories: number;
  };
}

export const SYMPTOMS_QUERY_KEYS = {
  all: ["symptoms"] as const,
  lists: () => [...SYMPTOMS_QUERY_KEYS.all, "lists"] as const,
  list: (param: Pagination) => [...SYMPTOMS_QUERY_KEYS.lists(), param] as const,
  details: () => [...SYMPTOMS_QUERY_KEYS.all, "details"] as const,
  detail: (id: string) => [...SYMPTOMS_QUERY_KEYS.details(), id] as const,
};

// ============ Query Hooks ============
export const useSymptoms = ({ page, limit }: Pagination) => {
  return useQuery<PaginatedResponse, Error>({
    queryKey: SYMPTOMS_QUERY_KEYS.list({ page, limit }),
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const [symptomsResults, categoriesResults, rpcResult] = await Promise.all(
        [
          supabase
            .from("symptoms")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to),
          supabase
            .from("categories")
            .select("id", { count: "exact" })
            .eq("level", 0),
          supabase.rpc("get_body_part_stats"),
        ]
      );

      if (symptomsResults.error) throw new Error(symptomsResults.error.message);
      if (categoriesResults.error)
        throw new Error(categoriesResults.error.message);
      if (rpcResult.error) throw new Error(rpcResult.error.message);

      const totalCount = symptomsResults.count ?? 0;

      return {
        symptoms: symptomsResults.data as TSymptomsOutput[],
        analytics: {
          mostAffectedBodyParts: rpcResult.data,
          totalCategories: categoriesResults.count as number,
        },
        meta: {
          totalPages: Math.ceil(totalCount / limit),
          total: totalCount,
          currentPage: page,
        },
      };
    },
  });
};

export const useSymptom = (id: string) => {
  return useQuery<any, Error>({
    queryKey: SYMPTOMS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptoms")
        .select(
          `*,
          symptoms_body_parts (body_part_id),
          symptoms_categories (category_id),
          symptoms_types (*),
                symptoms_causes (*),
                
                `
        )
        .eq("id", id)
        .single();

      if (error) {
        // If no record is found, .single() returns an error
        if (error.code === "PGRST116") {
          throw new Error(`Symptom with ID ${id} not found.`);
        }
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useBodyPartsForSymptoms = () => {
  return useQuery<any, Error>({
    queryKey: SYMPTOMS_QUERY_KEYS.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("body_parts")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useCategoriesForSymptoms = () => {
  return useQuery<any, Error>({
    queryKey: SYMPTOMS_QUERY_KEYS.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// =========== Mutation Hooks ==========

export const useCreateSymptom = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, TSymptomsInput>({
    mutationFn: async (data) => {
      const { data: symptomId, error } = await supabase.rpc(
        "register_symptom_complex",
        {
          s_payload: {
            name: data.name,
            slug: data.slug as string,
            nhs_link: data.nhsLink,
            image_url: data.imageUrl,
            about: data.about,
            is_systemic: data.isSystemic,
            diagnosis: data.diagnosis,
            treatment: data.treatment,
            complications: data.complications,
            prevention: data.prevention,
            specialist: data.specialistToContact,
            contact_your_doctor: data.contactYourDoctor,
            more_information: data.moreInformation,
            attribution: data.attribution,
          },
          body_part_ids: data.bodyPartIds,
          category_ids: data.categoryIds,
          s_types: data.types,
          s_causes: data.causes,
        }
      );
      if (error) throw new Error(error.message);
      return symptomId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SYMPTOMS_QUERY_KEYS.all,
      });
      toast.success("Symptom created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create symptom: ${error.message}`);
    },
  });
};

export const useUpdateSymptom = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, Partial<TSymptomsInput>>({});
};

export const useDeleteSymptom = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({});
};
