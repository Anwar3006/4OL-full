import { create } from "zustand";

type SignUpState = {
  first_name: string;
  last_name: string;
  dob: string;
  sex: string;
  email: string;

  setStep1Data: (data: {
    first_name: string;
    last_name: string;
    dob: string;
    sex: string;
  }) => void;
};

export const useSignUpStore = create<SignUpState>((set) => ({
  first_name: "",
  last_name: "",
  dob: "",
  sex: "",
  email: "",
  setStep1Data: (data) => set(data),
}));
