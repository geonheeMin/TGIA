import { create } from "zustand";

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
  paymentSuccess: boolean | null;
  setPaymentSuccess: (result: boolean | null) => void;
  rangeValue: number;
  setRangeValue: (value: number) => void;
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
  url: "http://223.194.128.33:8080", //geonhee,

  paymentSuccess: null,
  setPaymentSuccess: (result: boolean | null) => {
    set((state) => ({ paymentSuccess: result }));
  },
  rangeValue: 4,
  setRangeValue: (value: number) => {
    set((state) => ({rangeValue: value}));
  }
}));

export default useStore;
