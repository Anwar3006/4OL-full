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

//for the above state, when you refresh the app, the state will be lost. To persist the state, you can use zustand middleware like 'persist'.
// Example:

// import { persist } from 'zustand/middleware';

// const useUserStore = create<UserStore>()(
//   persist(
//     (set) => ({
//       user: null,
//       setUser: (user) => set({ user }),
//     }),
//     {
//       name: 'user-storage', // unique name
//     }
//   )
// );

// This will save the user state in local storage and rehydrate it on app load.

// or use mmkv, a key-value storage library for React Native, for better performance and security.
// check out: utils/zustand-mmkv.ts for an example of how to set it up with zustand.
// after defining the mmkv storage, you can use it like this:

// import zustandMMKVStorage from 'path/to/zustand-mmkv';
// import { persist, createJSONStorage } from 'zustand/middleware';

// const useUserStore = create<UserStore>()(
//   persist((set) => ({
//     user: null,
//     setUser: (user) => set({ user }),
// }), {
//   name: 'user-storage',
//   storage: createJSONStorage(() => zustandMMKVStorage)
// })
// );
