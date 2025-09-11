import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define your API slice
export const authApi = createApi({
  reducerPath: "authApi", // unique key in store
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.13.52:7040", // replace with your backend
  }),
  endpoints: (builder) => ({
    // POST request
    addUser: builder.mutation<
      any,
      { full_name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/register/",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (loginData) => ({
        url: "/auth/login/",
        method: "POST",
        body: loginData,
      }),
    }),
    verifyOtp: builder.mutation<any, { email: string; otp: string }>({
      query: (otpData) => ({
        url: "/auth/verify-otp/",
        method: "POST",
        body: otpData,
      }),
    }),
  }),
});

// export hooks for usage in components
export const { useAddUserMutation, useLoginMutation, useVerifyOtpMutation } =
  authApi;
