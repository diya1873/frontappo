import axios from "axios";
import { deleteProfile, setUser } from "./profileSlice";
import { setUserAuth } from "../auth/authSlice";
import axiosInstance from "../../app/axiosInstance";


// Get Profile
// import في الأعلى


export const getProfile = () => async (dispatch) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.user.token;
    const response = await axiosInstance.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setUser(response.data));
  } catch (error) {
    console.error("Failed to fetch profile", error);
  }
};


// Update Profile
export const updateProfile = (formData) => async (dispatch) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.user.token;
    const response = await axios.put("https://appointments-6zq4.onrender.com/api/users/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // <<< مهم جداً
      },
    });
   
    dispatch(setUser(response.data));// نحدث الداتا في الستور
   
    console.log('ediiitconsole',response?.data.user.avatar)
    const oldUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    oldUserInfo.user.user.avatar = response.data.user.avatar;
    oldUserInfo.user.user.name = response.data.user.name;
    console.log('avatarlocallll',oldUserInfo.user.user.avatar)
   
    localStorage.setItem("userInfo", JSON.stringify(oldUserInfo));
  // إذا كان لديك slice خاص بالـ auth يمكن تحديثه هنا أيضًا
  dispatch(setUserAuth(oldUserInfo));
    
  } catch (error) {
    console.error("Failed to update profile", error);
  }
};

export const deleteUserProfile = () => async (dispatch) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.user.token;
    await axiosInstance.delete("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("userInfo");
    dispatch(deleteProfile());
    window.location.href = "/register"; // إعادة التوجيه بعد الحذف
  } catch (error) {
    console.error("Failed to delete profile", error);
  }
};

