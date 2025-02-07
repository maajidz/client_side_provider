import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  chartId: string;
}

const initialState: UserState = {
  chartId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserId } = userSlice.actions;
export default userSlice.reducer;
