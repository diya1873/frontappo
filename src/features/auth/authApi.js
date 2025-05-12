import axios from 'axios';

import { register ,login } from './authSlice';


// دالة لتسجيل المستخدم
export const registerUser = async (dispatch, userData) => {
  try {
    const response = await axios.post('https://appointments-6zq4.onrender.com/api/users/register', userData);
    dispatch(register({ 
      message: response?.data?.message // إرجاع الرسالة الناجحة
    }));
  } catch (error) {
    dispatch(register({ 
      message: error.response?.data?.message || 'حدث خطأ غير معروف' // إرجاع رسالة الخطأ
    }));
  }
};

export const loginUser = async (dispatch, userData) => {
  try {
    const response = await axios.post('https://appointments-6zq4.onrender.com/api/users/login', userData);

   

    // تحديث الحالة في Redux مع إضافة الرسالة
    dispatch(login({ 
      user: response?.data,
      message: response?.data?.message || 'تم تسجيل الدخول بنجاح' // إضافة رسالة نجاح
      
    }));
   
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || 'حدث خطأ');

    // في حالة الخطأ، نعرض الرسالة المناسبة
    dispatch(login({
      message: error.response?.data?.message || 'حدث خطأ غير معروف أثناء تسجيل الدخول'
    }));
  }
};
