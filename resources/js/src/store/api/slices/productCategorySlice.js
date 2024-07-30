import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const productCategorySlice = createApi({
    reducerPath: "productCategoriesApi",

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
        fetchProductCategories: builder.query({
            query: (params) => "/product-categories" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["ProductCategories"],
        }),

        createProductCategory: builder.mutation({
            query: (data) => ({
                url: "/product-categories",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["ProductCategories"],
        }),

        fetchProductCategory: builder.query({
            query: (id) => `/product-categories/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["ProductCategories"],
        }),

        updateProductCategory: builder.mutation({
            query: (data) => ({
                url: `/product-categories/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["ProductCategories"],
        }),

        deleteProductCategory: builder.mutation({
            query: (id) => ({
                url: `/product-categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProductCategories"],
        }),
    }),
});

export const {
    useFetchProductCategoriesQuery,
    useCreateProductCategoryMutation,
    useFetchProductCategoryQuery,
    useUpdateProductCategoryMutation,
    useDeleteProductCategoryMutation,
} = productCategorySlice;
export default productCategorySlice;
