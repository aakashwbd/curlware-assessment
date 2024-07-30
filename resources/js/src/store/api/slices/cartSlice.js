import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const cartSlice = createApi({
    reducerPath: "cartsApi",

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
        fetchCarts: builder.query({
            query: (params) => "/carts" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["Carts"],
        }),

        createCart: builder.mutation({
            query: (data) => ({
                url: "/carts",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Carts"],
        }),

        fetchCart: builder.query({
            query: (id) => `/carts/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["Carts"],
        }),

        updateCart: builder.mutation({
            query: (data) => ({
                url: `/carts/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Carts"],
        }),

        deleteCart: builder.mutation({
            query: (id) => ({
                url: `/carts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Carts"],
        }),
    }),
});

export const {
    useFetchCartsQuery,
    useCreateCartMutation,
    useFetchCartQuery,
    useUpdateCartMutation,
    useDeleteCartMutation,
} = cartSlice;
export default cartSlice;
