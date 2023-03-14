import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface preset {
  session: Object | null;
  setSession: (id: string | null) => void;
}

type member = {
  user_id: number;
  id: string;
  username: string;
  email: string;
  profile_img: string;
  trackA: string;
};

const useStore = create<preset>((set) => ({
  session: null,
  setSession: (request: string | null) => {
    set((state) => ({ session: request }));
  }
}));

export default useStore;
