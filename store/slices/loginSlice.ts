// store/slices/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  providerAuthId: string;
  providerUniqueId: string;
  token: string | null;
  providerId: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  nip: string;
  phoneNumber: string;
}

const initialState: LoginState = {
  providerAuthId: "",
  providerUniqueId: "",
  providerId: "",
  token: null,
  firstName: "",
  lastName: "",
  email: "",
  roleName: "",
  nip: "",
  phoneNumber: ""
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<Partial<LoginState>>) => {
      return { ...state, ...action.payload };
    },
    resetLoginData: () => initialState,
  },
});

export const { setLoginData, resetLoginData } = loginSlice.actions;
export default loginSlice.reducer;
