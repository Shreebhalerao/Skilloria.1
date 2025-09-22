import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiconnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
}

// ================ buyCourse ================
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");

    try {
        // Load Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.error("Razorpay SDK failed to load");
            return;
        }

        // Initiate the order from backend
        const orderResponse = await apiconnector(
            "POST",
            COURSE_PAYMENT_API,
            { coursesId },
            { Authorization: `Bearer ${token}` }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        // Use the correct env variable for frontend
        const RAZORPAY_KEY = import.meta.env.VITE_APP_RAZORPAY_KEY;
        if (!RAZORPAY_KEY) {
            throw new Error("Razorpay key not found in frontend environment variables");
        }

        // Razorpay options
        const options = {
            key: RAZORPAY_KEY,
            currency: orderResponse.data.order.currency,
            amount: orderResponse.data.order.amount,
            order_id: orderResponse.data.order.id,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: userDetails.firstName,
                email: userDetails.email,
            },
            handler: function (response) {
                // Send success email
                sendPaymentSuccessEmail(response, orderResponse.data.order.amount, token);

                // Verify payment
                verifyPayment({ ...response, coursesId }, token, navigate, dispatch);
            },
        };

        // Open Razorpay checkout
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops, payment failed");
            console.error("Payment failed:", response.error);
        });
    } catch (error) {
        console.error("PAYMENT API ERROR:", error);
        toast.error(error.message || "Could not make Payment");
    }

    toast.dismiss(toastId);
}

// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiconnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            { Authorization: `Bearer ${token}` }
        );
    } catch (error) {
        console.error("PAYMENT SUCCESS EMAIL ERROR:", error);
    }
}

// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiconnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) throw new Error(response.data.message);

        toast.success("Payment Successful, you are added to the course!");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.error("PAYMENT VERIFY ERROR:", error);
        toast.error("Could not verify Payment");
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
