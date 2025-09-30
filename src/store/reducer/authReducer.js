import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
};

export const authSlice = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = action.payload;
    },
    logout: (state) => {
      state.auth = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
