import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define your API slice
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://10.10.13.52:7040", // replace with your backend
    baseUrl: "https://d134ef4fda6c.ngrok-free.app",
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
    verifyOtp: builder.mutation<
      any,
      { email: string; otp: string; purpose: string }
    >({
      query: (otpData) => ({
        url: "/auth/verify-otp/",
        method: "POST",
        body: otpData,
      }),
    }),
    forgotPass: builder.mutation<any, { email: string }>({
      query: (email) => ({
        url: "/auth/password-reset/request/",
        method: "POST",
        body: email,
      }),
    }),
    resendOtp: builder.mutation<any, { email: string }>({
      query: (eamil) => ({
        url: "/auth/resend-otp/",
        method: "POST",
        body: eamil,
      }),
    }),
    setNewPass: builder.mutation<any, {}>({
      query: (data) => ({
        url: "/auth/password-reset/confirm/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// export hooks for usage in components
export const {
  useAddUserMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useForgotPassMutation,
  useResendOtpMutation,
  useSetNewPassMutation,
} = authApi;
