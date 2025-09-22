const BASE_URL = import.meta.env.VITE_BASE_URL;




// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: `${BASE_URL}/auth/signUP`,
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/resetPasswordToken",
  RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",
}


// Categories API
export const categories = {
  CATEGORIES_API: `${BASE_URL}/course/showAllCategories`,
};

// Course endpoints
export const courseEndpoints = {
  GET_ALL_COURSE_API: `${BASE_URL}/course/getAllCourses`,
  COURSE_CATEGORIES_API: `${BASE_URL}/course/showAllCategories`,
  COURSE_DETAILS_API: `${BASE_URL}/course/getCourseDetails`,
  CREATE_COURSE_API: `${BASE_URL}/course/createCourse`,
  EDIT_COURSE_API: `${BASE_URL}/course/editCourse`,
  CREATE_SECTION_API: `${BASE_URL}/course/createSection`,
  CREATE_SUBSECTION_API:`${BASE_URL}/course/createSubSection`,
  UPDATE_SECTION_API: `${BASE_URL}/course/updateSection`,
  UPDATE_SUBSECTION_API:`${BASE_URL}/course/updateSubSection`,
  GET_ALL_INSTRUCTOR_COURSES_API:`${BASE_URL}/course/getInstructorCourses`,
  DELETE_SECTION_API: `${BASE_URL}/course/deleteSection`,
  DELETE_SUBSECTION_API: `${BASE_URL}/course/deleteSubSection`,
  DELETE_COURSE_API: `${BASE_URL}/course/deleteCourse`,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:`${BASE_URL}/course/getFullCourseDetails`,
  LECTURE_COMPLETION_API: `${BASE_URL}/course/updateCourseProgress`,

};


// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: `${BASE_URL}/profile/update-profile-image`,
  UPDATE_PROFILE_API: `${BASE_URL}/profile/UpdateProfile`,
  CHANGE_PASSWORD_API: `${BASE_URL}/auth/changePassword`,
  DELETE_PROFILE_API: `${BASE_URL}/profile/deleteProfile`,
}


// CATALOG PAGE DATA 
export const catalogData = {
  CATALOGPAGEDATA_API: `${BASE_URL}/course/categoryPageDetails`,
}



// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: `${BASE_URL}/profile/getUserDetails`,
  GET_USER_ENROLLED_COURSES_API: `${BASE_URL}/profile/getEnrolledCourses`,
  GET_INSTRUCTOR_DATA_API: `${BASE_URL}/profile/instructorDashboard`,
}

export const studentEndpoints ={
    COURSE_PAYMENT_API : `${BASE_URL}/Payments/capturePayment`,
    COURSE_VERIFY_API: `${BASE_URL}/Payments/verifyPayment`,
    SEND_PAYMENT_SUCCESS_EMAIL_API: `${BASE_URL}/Payments/sendPaymentSuccessEmail`,
}

 



