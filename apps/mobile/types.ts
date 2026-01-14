import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";

export type UserStore = {
  user: TUserProfile | null;
  setUser: (user: TUserProfile | null) => void;
};
