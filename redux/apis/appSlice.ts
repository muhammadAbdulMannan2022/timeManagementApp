import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export const baseUrl = "https://www.tickin.tools";

// raw base query
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// wrapper to catch 401
const baseQueryWithAuth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status =
      typeof result.error.status === "number" ||
      typeof result.error.status === "string"
        ? result.error.status
        : "UNKNOWN";

    const url = result.meta?.request?.url ?? "N/A";
    const data =
      typeof result.error.data === "string"
        ? result.error.data.trim()
        : JSON.stringify(result.error.data, null, 2);

    console.log(`⚠️ API Error [${status}] → ${url}\n${data}`);
  }

  if (result.error && result.error.status === 401) {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userEmail");

    api.dispatch({ type: "auth/logout" });

    router.replace("/(auth)");
  }

  return result;
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["BoilerPlate", "Tasks", "User", "Dates"], // Added tag types for resources
  endpoints: (builder) => ({
    updateBoilerPlate: builder.mutation({
      query: (data) => ({
        url: `/api/boiler-plate/${data.id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BoilerPlate"], // Already invalidates BoilerPlate
    }),
    tasks: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks to refetch getSingleById
    }),
    getUser: builder.query({
      query: () => "/auth/user-details/",
      providesTags: ["User"], // Provide User tag for refetching
    }),
    getDates: builder.query({
      query: () => "/api/get-all-date/",
      providesTags: ["Dates"], // Provide Dates tag for refetching
    }),
    getDataBySingleDate: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/filter-by-date/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks to refetch getSingleById
    }),
    getSingleById: builder.query({
      query: (id) => `/api/tasks/?client_uid=${id}`,
      providesTags: ["Tasks"], // Provide Tasks tag for refetching
    }),
    getBoilerPlate: builder.query({
      query: () => "/api/boiler-plate/",
      providesTags: ["BoilerPlate"], // Already provides BoilerPlate
    }),
    submitStep: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks to refetch getSingleById
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks to refetch getSingleById
    }),
    downloadPdf: builder.mutation({
      query: (data) => ({
        url: "/api/pdf/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks if it affects task data
    }),
    multipleItemPdf: builder.mutation({
      query: (data: any) => ({
        url: "/api/report-pdf/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks if it affects task data
    }),
    analytics: builder.mutation({
      query: (data: any) => ({
        url: "/api/dashboard/analytics/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks if analytics affects task data
    }),
    deleteItem: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Tasks"], // Invalidate Tasks to refetch getSingleById
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: "/auth/update/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate User to refetch getUser
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
  useMultipleItemPdfMutation,
  useAnalyticsMutation,
  useDeleteItemMutation,
  useUpdateSubscriptionMutation,
} = appApi;
