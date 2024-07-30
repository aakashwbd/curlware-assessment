import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const reportSlice = createApi({
    reducerPath: "reportsApi",

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
        fetchSummary: builder.query({
            query: (params) => "/reports/summary" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["Reports"],
        }),
    }),
});

export const { useFetchSummaryQuery } = reportSlice;
export default reportSlice;
