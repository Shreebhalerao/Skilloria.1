import {toast} from "react-hot-toast"
import { apiconnector} from "../apiconnector"
import { courseEndpoints } from "../apis"
import { data } from "react-router-dom"

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    LECTURE_COMPLETION_API,

}=courseEndpoints


//---------get All courses---------------
export const getAllCourses = async()=>{
    const toastId = toast.loading("Loading...")
    let result  = []


    try {
      const response =await apiconnector("GET",GET_ALL_COURSE_API)
      if(!response?.data?.success) throw new Error("Could Not Fetch Course Categories");

      result = response?.data?.data
      
      
    } catch (error) {
      console.log("GET_ALL_COURSE_API API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}





//---------fetch course Categories--------//
export const fetchCourseCategories = async()=>{
    let result =[]
    try {
        const response =await apiconnector("GET" , COURSE_CATEGORIES_API)
        console.log("COURSE_CATEGORIES_API RESPONSE.....",response)

        if(!response?.data?.success){
            throw new Error("could nor fetch  course categories");        
        }

        result = response?.data?.data
    } catch (error) {
        console.log("COURSE_CATEGORIES_API API Error......",error)
        toast.error(error.message)        
    }
    return result
}



//---------fetchCourseDetails--------//
export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await apiconnector("POST", COURSE_DETAILS_API, { courseId });
    console.log("COURSE_DETAILS_API API RESPONSE 👉", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch course details");
    }

    return response?.data;  // always return consistent shape
  } catch (error) {
    console.error("COURSE_DETAILS_API API ERROR 👉", error?.response || error);
    return error?.response?.data || { success: false, message: "Something went wrong" };
  }
};

//-----------create course ---------------

export const addCourseDetails = async (data ,token)=>{
  const toastId = toast.loading("Loading...")
  let result = null;

  try {
    const  response  =await apiconnector("POST" , CREATE_COURSE_API,data,{
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
      console.log("CREATE COURSE API RESPONSE............", response)
      
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    result = response?.data?.data
    toast.success("Course Details Added Successfully")
    
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


 // -------------------- Edit Course Details ----------


export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiconnector(
      "PUT",   // ✅ use PUT, not GET
      EDIT_COURSE_API,
      data,    // ✅ FormData object passed from component
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // ✅ use token passed from component
      }
    )

    console.log("✅ EDIT COURSE API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }

    result = response?.data?.data
    toast.success("Course Details Updated Successfully")
  } catch (error) {
    console.log("❌ EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  }

  toast.dismiss(toastId)
  return result
}


// ================ create Section ================
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiconnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }

    result = response?.data?.updatedCourseDetails
    toast.success("Course Section Created")
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ create SubSection ================
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiconnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Added")
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update Section ================
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiconnector("POST", UPDATE_SECTION_API, data, {
      authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }

    result = response?.data?.data
    toast.success("Course Section Updated")
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update SubSection ================
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiconnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Updated")
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete Section ================
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiconnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }

    result = response?.data?.data
    toast.success("Course Section Deleted")
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete SubSection ================
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("DELETE", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    result = response?.data?.data
    toast.success("Lecture Deleted")
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ fetch Instructor Courses ================
export const fetchInstructorCourses = async (token) => {
  let result = []
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

// ================ delete Course ================
export const deleteCourse = async (data, token) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
}

// ================ get Full Details Of Course ================
export const getFullDetailsOfCourse = async (courseId, token) => {
  if (!courseId) {
    console.error("getFullDetailsOfCourse: courseId is undefined");
    return null;
  }

  let result = null;
  try {
    const response = await apiconnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );

    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error);
    result = error.response?.data || { success: false, message: error.message };
  }

  return result;
};


// ================ mark Lecture As Complete ================
export const markLectureAsComplete = async (data, token) => {
  let result = null
  // console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE............", response)

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}
