import {toast} from "react-hot-toast"

import { setLoading, setToken, setUser } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice"
import { apiconnector } from "../apiconnector"
import { endpoints } from "../apis"


const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints




//------sendotp-------
export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));


        try {
            const response = await apiconnector("POST", SENDOTP_API,{
                email,
                checkUserPresent:true,
            })
            //if the no data found 
            if(!response.data.success){
                throw new error(response.data.message);
            }

            navigate("/VerifyEmail");
            toast.success("otp sent succesfully");

        } catch (error) {
            console.log("SENDOTP API ERROR --> ", error);
            toast.error(error.response.data?.message);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}


//--------sign up -----
//-------- SIGNUP ---------
export function signup(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating account...");
    dispatch(setLoading(true));

    try {
      const response = await apiconnector("POST", SIGNUP_API, {
        accountType:accountType.toLowerCase(),
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("Signup API response:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.log("Signup API error --->", error);

      // ✅ Show API error if available, fallback otherwise
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}




///-------login---------

export function login(email, password, navigate) {
  return async (dispatch) => {
    console.log("📌 login function CALLED with:", email, password);
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));

    try {
      const response = await apiconnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("Full API response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Success toast
      toast.success("Login successful");

      // Save token
      dispatch(setToken(response.data.token));

      // Fallback user image
      const userImage = response.data?.user?.userImage
        ? response.data.user.userImage
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      // Save user in redux
      dispatch(setUser({ ...response.data.user, image: userImage }));

      //  Save in localStorage
      localStorage.setItem("token", JSON.stringify(response.data?.token));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, image: userImage })
      );

      //  Navigate
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("Login API error:", error);

      //  Better error handling
      toast.error(error.response?.data?.message || "Login failed, try again.");
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}


// get password token
export function getPasswordResetToken(email, setEmailSent){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))

        try {
            const response = await apiconnector("POST", RESETPASSTOKEN_API, { email })
            console.log("RESET PASS TOKEN RESPONSE:", response)

            if(!response?.data?.success){
                throw new Error(response?.data?.message || "Something went wrong")
            }

            toast.success("Reset Email Sent")
            setEmailSent(true)
        } catch (error) {
            console.log("Reset pass token error:", error)
            toast.error(error.response?.data?.message || error.message)
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

// reset password
export function resetPassword(password, confirmPassword, token, navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))

        try {
            const response = await apiconnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token,
            })
            console.log("RESETPASSWORD RESPONSE:", response)

            if(!response?.data?.success){
                throw new Error(response?.data?.message || "Something went wrong")
            }

            toast.success("Password Reset Successfully")
            navigate("/login")
        } catch (error) {
            console.log("RESETPASSWORD ERROR:", error)
            toast.error(error.response?.data?.message || error.message)
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


//-------logout-------

export function logout(navigate){
    return(dispatch)=>{
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart(null))
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}