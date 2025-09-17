import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

export const baseUrl = "https://da65697a6bbb.ngrok-free.app";

// Wrap fetchBaseQuery to inject token
const baseQuery = fetchBaseQuery({
  baseUrl: "https://da65697a6bbb.ngrok-free.app",
  prepareHeaders: async (headers) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  // Define tag types for cache invalidation
  tagTypes: ["BoilerPlate"],
  endpoints: (builder) => ({
    updateBoilerPlate: builder.mutation({
      query: (data) => ({
        url: `/api/boiler-plate/${data.id}/`,
        method: "PATCH",
        body: data,
      }),
      // Invalidate the "BoilerPlate" tag to refetch getBoilerPlate
      invalidatesTags: ["BoilerPlate"],
    }),
    tasks: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: () => "/auth/user-details/",
    }),
    // Calendar
    getDates: builder.query({
      query: () => "/api/get-all-date/",
    }),
    getDataBySingleDate: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/filter-by-date/",
        method: "POST",
        body: data,
      }),
    }),
    getSingleById: builder.query({
      query: (id) => `/api/tasks/?client_uid=${id}`,
    }),
    // Get boiler plate
    getBoilerPlate: builder.query({
      query: () => "/api/boiler-plate/",
      // Provide the "BoilerPlate" tag for this query
      providesTags: ["BoilerPlate"],
    }),
    submitStep: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "POST",
        body: data,
      }),
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "PATCH",
        body: data,
      }),
    }),
    // PDF
    downloadPdf: builder.mutation({
      query: (data) => ({
        url: "/api/pdf/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Auto-generated hooks
export const {
  useTasksMutation,
  useGetUserQuery,
  useGetDatesQuery,
  useGetDataBySingleDateMutation,
  useGetSingleByIdQuery,
  useGetBoilerPlateQuery,
  useSubmitStepMutation,
  useDownloadPdfMutation,
  useUpdateTaskMutation,
  useUpdateBoilerPlateMutation,
} = appApi;
