import { createSlice } from '@reduxjs/toolkit';


const initialUser = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    message: '', // الرسالة التي سيتم إرجاعها
    user:initialUser,
  },
  reducers: {
    register: (state, action) => {
      state.message = action.payload.message; // تحديد الرسالة
    },
    //حطيتها عشان ينحفظ الداتا الجديدة من التعديل  وتتغير اليوزر واقدر اناديها باي مكان عشان تعمل  ري ريندر
    setUserAuth: (state, action) => {
      state.user = action.payload;
    },
    login: (state, action) => {
      state.message = action.payload.message;
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.message = ''; // مسح الرسالة عند تسجيل الخروج
    }
  },
});

export const { register,login, logout,setUserAuth } = authSlice.actions;

export default authSlice.reducer;
