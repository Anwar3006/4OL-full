import { supabase } from "@/lib/supabase";
import {
  TFacilityProfileInput,
  TFacilityProfileOutput,
} from "@4ol/db/schemas/facility-profile.schema";
import { useQuery } from "@tanstack/react-query";

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
};

export const FACILITY_PROFILE_QUERY_KEYS = {
  all: ["facilities"] as const,
  map: ["map"] as const,
  lists: () => [...FACILITY_PROFILE_QUERY_KEYS.all, "lists"] as const,
  list: (params: Pagination) =>
    [...FACILITY_PROFILE_QUERY_KEYS.lists(), { ...params }] as const,
  details: () => [...FACILITY_PROFILE_QUERY_KEYS.all, "details"] as const,
  detail: (id: string) =>
    [...FACILITY_PROFILE_QUERY_KEYS.details(), id] as const,
};

export const useFacilityProfiles = (params: Pagination) => {
  return useQuery<any, Error>({
    queryKey: FACILITY_PROFILE_QUERY_KEYS.list(params),
    queryFn: async () => {
      const { limit, page, search, status, type } = params;
      const from = ((page || 1) - 1) * (limit || 10);
      const to = from + (limit || 10) - 1;

      const query = supabase
        .from("facility_profile")
        .select("*", { count: "exact" });

      if (search) {
        query.or(
          `facility_name.ilike.%${search}%,district.ilike.%${search}%,region.ilike.%${search}%`,
        );
      }
      if (status) {
        query.eq("status", status);
      }
      if (type) {
        query.eq("facility_type", type);
      }

      const facilitiesResponse = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (facilitiesResponse.error) throw facilitiesResponse.error;

      const totalCount = facilitiesResponse.count || 0;
      return {
        facilities: facilitiesResponse.data,
        meta: {
          total: totalCount, // Extract count from the data query
          totalPages: Math.ceil(
            (facilitiesResponse.count || 0) / (limit || 10),
          ),
          currentPage: page,
          totalCount,
        },
      };
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

export const useGetFacilitiesMapData = ({
  minLng,
  minLat,
  maxLng,
  maxLat,
  zoom,
  enabled,
}: {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
  zoom: number;
  enabled: boolean;
}) => {
  return useQuery<any, Error>({
    queryKey: [
      FACILITY_PROFILE_QUERY_KEYS.map,
      minLng,
      minLat,
      maxLng,
      maxLat,
      Math.round(zoom),
    ],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_facilities_map", {
        minlng: minLng,
        minlat: minLat,
        maxlng: maxLng,
        maxlat: maxLat,
        zoom_level: Math.round(zoom),
      });

      if (error) throw error;
      return data; // This is a perfectly formatted GeoJSON object
    },
    enabled: enabled,
    placeholderData: (prev: any) => prev,
    staleTime: 1000 * 60, //Every 1 min
  });
};

export const getTopRatedFacilities = async () => {
  return useQuery<TFacilityProfileOutput[], Error>({
    queryKey: FACILITY_PROFILE_QUERY_KEYS.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_profile")
        .select("*")
        .gte("rating", 4)
        .order("avg_rating", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
