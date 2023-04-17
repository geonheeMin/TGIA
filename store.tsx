import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface preset {
  session: Object | null;
  setSession: (id: Object | null) => void;
  hasSession: boolean;
  setHasSession: (result: boolean) => void;
  url: string;
}

const useStore = create<preset>((set) => ({
  session: null,
  setSession: (request: Object | null) => {
    set((state) => ({ session: request }));
  },
  hasSession: false,
  setHasSession: (result: boolean) => {
    set((state) => ({ hasSession: result }));
  },
  url: "http://3.37.128.34:8080"

  //url: "http://3.36.75.115:8080" geonhee
}));

export default useStore;
