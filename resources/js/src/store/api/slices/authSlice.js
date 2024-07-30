import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenSetter } from "../../../utils/Helpers";

const authSlice = createApi({
    reducerPath: "authApi",

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
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
        }),

        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
        }),

        oAuthLogin: builder.mutation({
            query: (data) => ({
                url: `/auth/oauth-login/${data}`,
                method: "POST",
            }),
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data,
        }),

        authUpdate: builder.mutation({
            query: (data) => ({
                url: "/auth/update",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: JSON.stringify(data),
            }),
            transformResponse: (response, meta, arg) => response,
            transformErrorResponse: (response, meta, arg) => response.data,
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useAuthUpdateMutation,
    useChangePasswordMutation,

    useOAuthLoginMutation,
} = authSlice;
export default authSlice;
