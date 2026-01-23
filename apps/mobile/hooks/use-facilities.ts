import { supabase } from "@/lib/supabase";
import {
  TFacilityProfileInput,
  TFacilityProfileOutput,
} from "@4ol/db/schemas/facility-profile.schema";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

export const useFacilityProfiles = (filters: Omit<Pagination, "page">) => {
  // console.log("Filters: ", filters);
  return useInfiniteQuery({
    // We only put filters in the key, NOT the page.
    // This ensures that when we fetch page 2, we don't clear page 1.
    queryKey: FACILITY_PROFILE_QUERY_KEYS.list(filters),

    queryFn: async ({ pageParam = 1 }) => {
      const limit = filters.limit || 10;
      const from = (pageParam - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("facility_profile")
        .select("*", { count: "exact" })
        .eq("status", "active");

      // Apply Filters
      if (filters.search) {
        // Add ::text to any column that is an Enum or not a standard string
        query.or(
          `facility_name.ilike.%${filters.search}%,area.ilike.%${filters.search}%`,
        );
      }

      if (filters.type) {
        query = query.eq("facility_type", filters.type);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        facilities: data,
        currentPage: pageParam,
        totalCount,
        totalPages,
      };
    },

    // Logic to determine if there is another page to fetch
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },

    initialPageParam: 1,
    // Keep data on screen while fetching next page for "Zero-Flicker"
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
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
