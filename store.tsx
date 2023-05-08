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
  //url: "http://3.35.217.228:8080" //yongki
  //url: "http://223.194.135.151:8080" // 민규
  url: "http://223.194.132.111:8080" //geonhee
}));

export default useStore;
