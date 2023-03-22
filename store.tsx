import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface preset {
  session: Object | null;
  setSession: (id: Object | null) => void;
  hasSession: boolean;
  setHasSession: (result: boolean) => void;
}

const useStore = create<preset>((set) => ({
  session: null,
  setSession: (request: Object | null) => {
    set((state) => ({ session: request }));
  },
  hasSession: false,
  setHasSession: (result: boolean) => {
    set((state) => ({ hasSession: result }));
  }
}));

export default useStore;
