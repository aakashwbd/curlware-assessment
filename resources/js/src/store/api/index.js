import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import employeeSlice from "./slices/employeeSlice";
import orderSlice from "./slices/orderSlice";
import paymentGatewaySlice from "./slices/paymentGatewaySlice";
import productCategorySlice from "./slices/productCategorySlice";
import productSlice from "./slices/productSlice";
import reportSlice from "./slices/reportSlice";
import roleSlice from "./slices/roleSlice";
import siteSlice from "./slices/siteSlice";

export const apiReducers = {
    [authSlice.reducerPath]: authSlice.reducer,

    [productSlice.reducerPath]: productSlice.reducer,
    [productCategorySlice.reducerPath]: productCategorySlice.reducer,
    [cartSlice.reducerPath]: cartSlice.reducer,
    [orderSlice.reducerPath]: orderSlice.reducer,
    [paymentGatewaySlice.reducerPath]: paymentGatewaySlice.reducer,
    [reportSlice.reducerPath]: reportSlice.reducer,

    [roleSlice.reducerPath]: roleSlice.reducer,
    [employeeSlice.reducerPath]: employeeSlice.reducer,

    [siteSlice.reducerPath]: siteSlice.reducer,
};
export const apiMiddleWares = [
    authSlice.middleware,

    productSlice.middleware,
    productCategorySlice.middleware,
    cartSlice.middleware,
    orderSlice.middleware,
    paymentGatewaySlice.middleware,
    reportSlice.middleware,

    roleSlice.middleware,
    employeeSlice.middleware,

    siteSlice.middleware,
];
