import { supabase } from "@/lib/supabase";
import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserProfile = (id: string) => {
  return useQuery<TUserProfile, Error>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select()
        .eq("user_id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const { data: result, error } = await supabase
        .from("user_profiles")
        .update({
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          sex: data.sex,
          dob: data.dob,
          user_type: data.user_type,
          role: data.role,
          phone_number: data.phone_number,
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
  });
};
