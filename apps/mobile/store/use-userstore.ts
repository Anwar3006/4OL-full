import { create } from "zustand";
import { UserStore } from "@/types";

import zustandMMKVStorage from "@/lib/zustand-mmkv";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logoutUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);

export default useUserStore;
