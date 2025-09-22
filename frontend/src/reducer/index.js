import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import profileReducer from "../slices/profileSlice"
import sidebarSlice from "../slices/sidebarSlice"
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from "../slices/viewCourseSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  profile: profileReducer,
  sidebar: sidebarSlice ,
  course: courseReducer,
  viewCourse:viewCourseReducer,
});

export default rootReducer;
