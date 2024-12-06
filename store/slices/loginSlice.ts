// store/slices/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    providerAuthId: string,
    token: string,
    providerId: string,
    firstName: string,
    lastName: string,
    email: string,
}

const initialState: LoginState = {
    providerAuthId: '',
    providerId: '',
    token: '',
    firstName: '',
    lastName: '',
    email: '',
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
