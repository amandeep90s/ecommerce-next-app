import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ERole } from '@/enums';

// Serializable, non-sensitive snapshot of the authenticated user.
// Never store password, refresh_token, or raw ObjectIds here.
export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
  avatar?: {
    url?: string;
    public_id?: string;
  };
  phone?: string;
}

interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
