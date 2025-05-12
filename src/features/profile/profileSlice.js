// src/features/profile/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  message: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    editProfile: (state, action) => {
      state.user = action.payload;
      state.message = "Profile updated successfully";
    },
    deleteProfile: (state) => {
      state.user = null;
      state.message = "Profile deleted successfully";
    },
  },
});

export const { setUser, editProfile, deleteProfile } = profileSlice.actions;
export default profileSlice.reducer;
