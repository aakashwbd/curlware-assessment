import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const employeeSlice = createApi({
    reducerPath: "employeesApi",

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
        fetchEmployees: builder.query({
            query: (params) => "/employees" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["Employees"],
        }),

        createEmployee: builder.mutation({
            query: (data) => ({
                url: "/employees",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Employees"],
        }),

        fetchEmployee: builder.query({
            query: (id) => `/employees/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["Employees"],
        }),

        updateEmployee: builder.mutation({
            query: (data) => ({
                url: `/employees/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Employees"],
        }),

        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `/employees/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employees"],
        }),
    }),
});

export const {
    useFetchEmployeesQuery,
    useCreateEmployeeMutation,
    useFetchEmployeeQuery,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeSlice;
export default employeeSlice;
