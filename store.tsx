import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Object = {
  atrackId: number;
  btrackId: number;
  firstTrack: string;
  secondTrack: string;
  first_department: string;
  second_department: string;
  first_college: string;
  second_college: string;
  imageFileName: string;
  mannerscore: number;
  username: string;
  member_id: number;
};

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
  //url: "http://223.194.129.143:8080" // 민규
  url: "http://13.125.109.13:8080" //geonhee
}));

export default useStore;
