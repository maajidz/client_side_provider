import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  chartId: string;
}

const initialState: UserState = {
  chartId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setChartId: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setChartId } = userSlice.actions;
export default userSlice.reducer;
