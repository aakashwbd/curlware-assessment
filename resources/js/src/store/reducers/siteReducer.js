import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    skin: "dark",
    cartItems: [],
};

const siteSlice = createSlice({
    name: "site",
    initialState,
    reducers: {
        setSkin: (state, action) => {
            state.skin = action.payload;
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
    },
});

export const { setSkin, setCartItems } = siteSlice.actions;
export default siteSlice.reducer;
