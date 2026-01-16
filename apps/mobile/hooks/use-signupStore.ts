import { create } from "zustand";

type SignUpState = {
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;

  email: string;
  setStep1Data: (data: {
    firstName: string;
    lastName: string;
    dob: string;
    sex: string;
  }) => void;
  setStep2Data: (data: { email: string }) => void;
};

export const useSignUpStore = create<SignUpState>((set) => ({
  firstName: "",
  lastName: "",
  dob: "",
  sex: "",
  email: "",
  setStep1Data: (data) => set(data),
  setStep2Data: (data) => set(data),
}));
