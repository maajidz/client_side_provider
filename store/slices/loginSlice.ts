// store/slices/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    adminId: string,
    roleName: string,
    adminUsername: string;
    authToken: string;
    roleId: string;
}

const initialState: LoginState = {
    adminId: '',
    roleName: '',
    adminUsername: '',
    authToken: '',
    roleId: ''
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoginData: (state, action: PayloadAction<Partial<LoginState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setLoginData } = loginSlice.actions;
export default loginSlice.reducer;
