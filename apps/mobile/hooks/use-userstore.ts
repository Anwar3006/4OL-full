import { TBetterAuthUser } from "@4ol/db/schemas/user-profile.schema";
import { create } from "zustand";

interface UserStore {
  user: TBetterAuthUser | null;
  setUser: (user: TBetterAuthUser | null) => void;
}

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;

// ======================== Usage Example ========================
// import useUserStore from 'path/to/use-userstore';
// const { user, setUser } = useUserStore();
//
// const {session, user} = betterAuth.useSession();
// setUser(user);
