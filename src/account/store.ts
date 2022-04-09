import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface ILoginPayload {
  token: string;
  uid: string;
  name: string;
  email: string;
  about?: string;
}

export interface IUpdatePayload {
  name: string;
  about?: string;
}

export interface AuthState {
  isLogged: boolean;
  token?: string;
  uid?: string;
  name?: string;
  email?: string;
  about?: string;
}

/* Auth initial state */
const initialState: AuthState = {
  isLogged: false,
};

/* Declare the auth redux store slice */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginPayload>) => {
      state.isLogged = true;
      state.token = action.payload.token;
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.about = action.payload.about;
    },
    updateProfile: (state, action: PayloadAction<IUpdatePayload>) => {
      state.name = action.payload.name;
      state.about = action.payload.about;
    },
    logout: (state) => {
      state.isLogged = false;
      state.token = undefined;
      state.uid = undefined;
      state.name = undefined;
      state.email = undefined;
    },
  },
});

/* Export the available store actions */
export const { login, updateProfile, logout } = authSlice.actions;

/* Declare base selectors */
export const isLogged = (state: RootState) => state.auth.isLogged;
export const authToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
