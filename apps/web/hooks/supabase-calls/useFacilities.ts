import { moveFile } from "@/actions/media-storage.actions";
import { supabase } from "@/lib/supabase";
import {
  TFacilityProfileInput,
  TFacilityProfileOutput,
} from "@4ol/db/schemas/facility-profile.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PaginatedResponse {
  data: TFacilityProfileInput[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  analytics: {
    active: number;
    inactive: number;
    pending: number;
    rejected: number;
  };
}

type Pagination = {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
  type?: string;
  includeStatsOnly: boolean;
};

export const FACILITY_PROFILE_QUERY_KEYS = {
  all: ["facilities"] as const,
  lists: () => [...FACILITY_PROFILE_QUERY_KEYS.all, "lists"] as const,
  list: (params: Pagination) =>
    [...FACILITY_PROFILE_QUERY_KEYS.lists(), { ...params }] as const,
  details: () => [...FACILITY_PROFILE_QUERY_KEYS.all, "details"] as const,
  detail: (id: string) =>
    [...FACILITY_PROFILE_QUERY_KEYS.details(), id] as const,
};

//=========== Query Hooks ========

export const useFacilityProfiles = (params: Pagination) => {
  return useQuery<any, Error>({
    queryKey: FACILITY_PROFILE_QUERY_KEYS.list(params),
    queryFn: async () => {
      const { limit, page, search, status, type, includeStatsOnly } = params;
      const from = ((page || 1) - 1) * (limit || 10);
      const to = from + (limit || 10) - 1;

      const query = supabase.from("facility_profile").select("*");
      if (search) {
        query.or(
          `facility_name.ilike.%${search}%,district.ilike.%${search}%,region.ilike.%${search}%`
        );
      }
      if (status) {
        query.eq("status", status);
      }
      if (type) {
        query.eq("facility_type", type);
      }

      if (includeStatsOnly) {
        const statsResult = await supabase
          .from("facility_profile")
          .select("status");

        if (statsResult.error) throw statsResult.error;
        //Process Stats (Client-side aggregation is faster than a 3rd query)
        const rawStats = statsResult.data;
        const statsMap = {
          active: rawStats.filter((s) => s.status === "active").length,
          inactive: rawStats.filter((s) => s.status === "inactive").length,
          pending: rawStats.filter((s) => s.status === "pending").length,
          rejected: rawStats.filter((s) => s.status === "rejected").length,
        };

        const totalCount = statsResult.count ?? 0;
        return {
          meta: {
            total: totalCount,
            totalPages: Math.ceil(totalCount / (limit || 10)),
            currentPage: page,
          },
          analytics: statsMap,
        };
      } else {
        const [facilitiesResult, statsResult] = await Promise.all([
          query.order("created_at", { ascending: false }).range(from, to),
          supabase.from("facility_profile").select("status"),
        ]);

        if (facilitiesResult.error) throw facilitiesResult.error;
        if (statsResult.error) throw statsResult.error;

        //Process Stats (Client-side aggregation is faster than a 3rd query)
        const rawStats = statsResult.data;
        const statsMap = {
          active: rawStats.filter((s) => s.status === "active").length,
          inactive: rawStats.filter((s) => s.status === "inactive").length,
          pending: rawStats.filter((s) => s.status === "pending").length,
          rejected: rawStats.filter((s) => s.status === "rejected").length,
        };

        const totalCount = facilitiesResult.count ?? 0;

        return {
          facilities: facilitiesResult.data as TFacilityProfileInput[],
          meta: {
            total: facilitiesResult.count,
            totalPages: Math.ceil(totalCount / (limit || 10)),
            currentPage: page,
          },
          analytics: statsMap,
        };
      }
    },
  });
};

export const useFacilityProfile = ({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: FACILITY_PROFILE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const result = await supabase
        .from("facility_profile")
        .select("*")
        .eq("id", id);
      if (result.error) throw result.error;
      return result.data[0] as TFacilityProfileOutput;
    },
    enabled: enabled,
  });
};

//TODO: Complete this hook
export const getFacilitiesMapData = async () => {};

//TODO: Complete this hook
export const getTopRatedFacilities = async () => {};

//=================== Mutation Hooks ================
export const useCreateFacilityProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TFacilityProfileInput) => {
      const payload = {
        ...data,
        // facility_name: data.facilityName,
        // facility_type: data.facilityType,
        // first_name: data.firstName,
        // last_name: data.lastName,
        // owner_email: data.ownerEmail,
        // contact_number: data.contactNumber,
        // person_contact_number: data.personContactNumber,
        // whatsapp_number: data.whatsappNumber,
        // gps_address: data.gpsAddress,
        // post_code: data.postCode,
        // media_urls: data.mediaUrls,
        keywords:
          typeof data.keywords === "string"
            ? data.keywords.split(",")
            : data.keywords,

        firstName: undefined,
      };
      //   console.log(">>>: ", payload);

      const { data: facility, error } = await supabase.rpc(
        "register_facility_with_profile",
        {
          p_owner_id: data.ownerId,
          p_first_name: data.first_name,
          p_last_name: data.last_name,
          p_phone_number: data.person_contact_number,
          p_facility_data: { ...payload },
        }
      );

      if (error) {
        console.error("Supabase RPC Error:", error);
        throw new Error(error.message);
      }

      return facility;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FACILITY_PROFILE_QUERY_KEYS.all,
      });
      toast.success("Facility profile created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create facility profile: ${error.message}`);
    },
  });
};

//TODO: Complete this hook
export const useUpdateFacilityProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (input: TFacilityProfileInput) => {
      const { data, error } = await supabase.rpc("update_facility_profile", {
        input,
      });

      if (error) throw new Error(error.message);

      return { success: true, data };
    },
  });
};

export const useApproveFacility = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { id: string; status: string; media_urls: string[] }
  >({
    mutationFn: async ({
      id,
      status,
      media_urls,
    }: {
      id: string;
      status: string;
      media_urls: string[];
    }) => {
      //   const { data, error } = await supabase
      //     .from("facility_profiles")
      //     .select("id, status, media_urls")
      //     .eq("id", id)
      //     .single();

      //   if (error) throw new Error(error.message);

      if (status !== "pending") {
        throw new Error("Facility is not in pending status");
      }

      const moveApprovedImagesPromise = () =>
        media_urls.map(async (urlPath: string) => {
          const filePath = urlPath.replace("temporary", "approved");
          if (urlPath === filePath) {
            console.error(
              `Skip copy: Source and destination are identical for ${urlPath}`
            );
          }

          const newPath = filePath.split("/");
          const filename = newPath.at(-1);
          const newFilePath = `facilities/approved/${id}/${filename}`;

          // Move the files over to new location
          await moveFile(urlPath, newFilePath);

          return newFilePath;
        });

      const newFilePaths = await Promise.all(moveApprovedImagesPromise());

      const { error: updateError } = await supabase
        .from("facility_profile")
        .update({
          status: "active",
          approved_at: new Date(),
          media_urls: newFilePaths,
        })
        .eq("id", id);

      if (updateError) {
        throw new Error(updateError.message);
      } else {
        return { sucess: true, newFilePaths };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FACILITY_PROFILE_QUERY_KEYS.all,
      });
      toast.success("Facility has been successfully approved");
    },
    onError: (error) => {
      toast.error("Failed to approve facility: " + error.message);
    },
  });
};

//TODO: Test this hook
export const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string }>({
    mutationFn: async ({ id }: { id: string }) => {
      const { data, error } = await supabase
        .from("facility_profile")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      return { success: true, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FACILITY_PROFILE_QUERY_KEYS.all,
      });
      toast.success("Facility successfully deleted!");
    },
    onError: (error) => {
      toast.success("Failed to delete facility: " + error.message);
    },
  });
};
