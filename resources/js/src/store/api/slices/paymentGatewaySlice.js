import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const paymentGatewaySlice = createApi({
    reducerPath: "paymentGatewaysApi",

    baseQuery: fetchBaseQuery({
        baseUrl: window.origin + "/api/v1",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        prepareHeaders: (headers, { getState }) => {
            return tokenSetter(headers);
        },
    }),

    keepUnusedDataFor: 10,
    refetchOnReconnect: true,

    endpoints: (builder) => ({
        fetchPaymentGateways: builder.query({
            query: (params) => "/payment-gateways" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["PaymentGateways"],
        }),

        createPaymentGateway: builder.mutation({
            query: (data) => ({
                url: "/payment-gateways",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["PaymentGateways"],
        }),

        fetchPaymentGateway: builder.query({
            query: (id) => `/payment-gateways/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["PaymentGateways"],
        }),

        updatePaymentGateway: builder.mutation({
            query: (data) => ({
                url: `/payment-gateways/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["PaymentGateways"],
        }),

        deletePaymentGateway: builder.mutation({
            query: (id) => ({
                url: `/payment-gateways/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PaymentGateways"],
        }),
    }),
});

export const {
    useFetchPaymentGatewaysQuery,
    useCreatePaymentGatewayMutation,
    useFetchPaymentGatewayQuery,
    useUpdatePaymentGatewayMutation,
    useDeletePaymentGatewayMutation,
} = paymentGatewaySlice;
export default paymentGatewaySlice;
