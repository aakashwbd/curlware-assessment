import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const orderSlice = createApi({
    reducerPath: "ordersApi",

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
        fetchOrders: builder.query({
            query: (params) => "/orders" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["Orders"],
        }),

        createOrder: builder.mutation({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Orders"],
        }),

        fetchOrder: builder.query({
            query: (id) => `/orders/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["Orders"],
        }),

        updateOrder: builder.mutation({
            query: (data) => ({
                url: `/orders/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Orders"],
        }),

        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Orders"],
        }),

        fetchTransactions: builder.query({
            query: (params) => "/transactions" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
        }),
    }),
});

export const {
    useFetchOrdersQuery,
    useCreateOrderMutation,
    useFetchOrderQuery,
    useUpdateOrderMutation,
    useDeleteOrderMutation,

    useFetchTransactionsQuery
} = orderSlice;
export default orderSlice;
