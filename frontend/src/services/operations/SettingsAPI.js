import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiconnector } from "../apiconnector";

import {settingsEndpoints} from "../apis"
import { logout } from "./authAPI"


const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

//--------usdate user profile image-------
export function updateUserProfileImage(token ,formData){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading")


        try {
            console.log("Sending token from frontend:", token);

            const response = await apiconnector(
                "PUT", 
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                  
                    authorization: `Bearer ${token}`,

                }
            )

            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE.......",response)


            if(!response.data.success){
                throw new Error(response.data.message);
                
            }

            toast.success("diplay picture updated succefully")
            dispatch(setUser(response.data.data));

            // below line is must - if not code - then as we refresh the page after changing profile image then old profile image will show 
            // as we only changes in user(store) not in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.data));
        } catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Profile Picture")
        }
        toast.dismiss(toastId)
    }
}



//-------update profile---------

// ------- update profile ---------

export function UpdateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

    try {
      const response = await apiconnector("POST", UPDATE_PROFILE_API, formData, {
        authorization: `Bearer ${token}`,
      });

      console.log("UPDATE_PROFILE_API API RESPONSE.....", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ Use response.data.user instead of updatedUserDetails
      const userData = response.data.user;

      // ✅ handle image
      const userImage = userData?.image
        ? userData.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`;

      // ✅ update redux state
      dispatch(setUser({ ...userData, image: userImage }));

      // ✅ update local storage
      localStorage.setItem("user", JSON.stringify({ ...userData, image: userImage }));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Update Profile");
    }

    toast.dismiss(toastId);
  };
}




//------------change password-------------

export async function changePassword(token , formData) {
    const toastId = toast.loading("Loading...")
    
    try {
        const response =await apiconnector("POST", CHANGE_PASSWORD_API, formData,{
            authorization : `Bearer ${token}`,
        })

        console.log("CHANGE_PASSWORD_API API RESPONSE.....",response);

        if(!response.data.success){
            throw new Error(response.data.message);
            
        }

        toast.success("Password changed succefully")
        
    } catch (error) {
        console.log("CHANGE_PASSWORD_API API ERROR............", error)
         const errorMsg =
            error?.response?.data?.message || error.message || "Password change failed";

        toast.error(errorMsg);
        console.log("ERROR MESSAGE....", errorMsg);
    }
    toast.dismiss(toastId)
}


//---------delete profile-------
export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

    try {
      const response = await apiconnector("DELETE", DELETE_PROFILE_API, null, {
        authorization: `Bearer ${token}`,
      });

      console.log("DELETE_PROFILE_API API RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.dismiss(toastId);
      toast.success("Profile deleted successfully");

      // delay logout so toast displays before navigation clears component
      setTimeout(() => {
        dispatch(logout(navigate));
      }, 500);

    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR...........", error);
      toast.dismiss(toastId);
      toast.error("Could Not delete profile");
    }
  };
}
