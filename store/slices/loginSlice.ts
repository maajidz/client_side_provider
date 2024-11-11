// store/slices/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    providerAuthId: string,
    token: string,
    providerId: string
}

const initialState: LoginState = {
    providerAuthId: '',
    providerId: '',
    token: ''
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
