import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const roleSlice = createApi({
    reducerPath: "rolesApi",

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
        fetchRoles: builder.query({
            query: (params) => "/roles" + `?${params}`,
            transformResponse: (response, meta, arg) => response.data,
            providesTags: ["Roles"],
        }),

        createRole: builder.mutation({
            query: (data) => ({
                url: "/roles",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Roles"],
        }),

        fetchRole: builder.query({
            query: (id) => `/roles/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
            providesTags: ["Roles"],
        }),

        updateRole: builder.mutation({
            query: (data) => ({
                url: `/roles/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data),
            }),
            transformErrorResponse: (response, meta, arg) => response.data,
            invalidatesTags: ["Roles"],
        }),

        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Roles"],
        }),

        fetchPermissions: builder.query({
            query: (params) => "/permissions" + `${params ? `?${params}` : ""}`,
            transformResponse: (response, meta, arg) => response.data,
        }),

        fetchAssignedPermissions: builder.query({
            query: (params) =>
                "/get-assigned-permissions" + `${params ? `?${params}` : ""}`,
            transformResponse: (response, meta, arg) => response.data,
        }),

        assignPermission: builder.mutation({
            query: (data) => ({
                url: "/assign-permissions",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
        }),
    }),
});

export const {
    useFetchRolesQuery,
    useCreateRoleMutation,
    useFetchRoleQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,

    useFetchPermissionsQuery,
    useAssignPermissionMutation,
    useFetchAssignedPermissionsQuery,
} = roleSlice;
export default roleSlice;
