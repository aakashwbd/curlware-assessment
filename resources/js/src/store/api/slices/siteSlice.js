import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const siteSlice = createApi({
    reducerPath: "siteApi",

    baseQuery: fetchBaseQuery({
        baseUrl: window.origin + "/api/v1",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        // prepareHeaders: (headers, { getState }) => {
        //     return tokenSetter(headers);
        // },
    }),

    keepUnusedDataFor: 10,
    refetchOnReconnect: true,

    endpoints: (builder) => ({
        fetchMediaFiles: builder.query({
            query: (params) => `media-files?${params}`,
            transformResponse: (response) => response.data,
            providesTags: ["MediaFiles"],
        }),
        fetchSiteCategories: builder.query({
            query: (params) => `/site/categories${params ? `?${params}` : ""}`,
            transformResponse: (response) => response.data,
        }),
        fetchSiteProducts: builder.query({
            query: (params) => `/site/products${params ? `?${params}` : ""}`,
            transformResponse: (response) => response.data,
        }),
        fetchSiteProduct: builder.query({
            query: (id) => `/site/products/${id}`,
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useFetchMediaFilesQuery,
    useFetchSiteCategoriesQuery,
    useFetchSiteProductsQuery,
    useFetchSiteProductQuery,
} = siteSlice;
export default siteSlice;
