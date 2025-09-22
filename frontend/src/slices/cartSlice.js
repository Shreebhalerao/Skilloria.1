import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    // get cart from localStorage
    cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],

    // total price
    total: 0, 

    // total items
    totalItems: 0,
};

// Initialize total and totalItems from localStorage cart
if (initialState.cart.length > 0) {
    initialState.total = initialState.cart.reduce((acc, course) => acc + Number(course.Price), 0);
    initialState.totalItems = initialState.cart.length;
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id);

            if (index >= 0) {
                toast.error("Course already in cart");
                return;
            }

            state.cart.push(course);
            state.totalItems++;
            state.total +=Number(course.Price);

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

            toast.success("Course added to cart");
        },

        removeFromCart(state, action) {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index >= 0) {
                state.totalItems--;
                state.total -= Number(state.cart[index].Price);
                state.cart.splice(index, 1);

                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

                toast.success("Course removed from cart");
            }
        },

        resetCart(state) {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },
    },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
