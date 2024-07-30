import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const productSlice = createApi({
    reducerPath: "productsApi",

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
        fetchProducts: builder.query({
            query: (params) => "/products" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["Products"],
        }),

        createProduct: builder.mutation({
            query: (data) => ({
                url: "/products",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Products"],
        }),

        fetchProduct: builder.query({
            query: (id) => `/products/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["Products"],
        }),

        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/products/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Products"],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useFetchProductsQuery,
    useCreateProductMutation,
    useFetchProductQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productSlice;
export default productSlice;
