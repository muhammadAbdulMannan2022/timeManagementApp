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
  tagTypes: ["BoilerPlate"],
  endpoints: (builder) => ({
    updateBoilerPlate: builder.mutation({
      query: (data) => ({
        url: `/api/boiler-plate/${data.id}/`,
        method: "PATCH",
        body: data,
      }),
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
    getBoilerPlate: builder.query({
      query: () => "/api/boiler-plate/",
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
    downloadPdf: builder.mutation({
      query: (data) => ({
        url: "/api/pdf/",
        method: "POST",
        body: data,
      }),
    }),
    multipleItemPdf: builder.mutation({
      query: (data: any) => ({
        url: "/api/report-pdf/",
        method: "POST",
        body: data,
      }),
    }),
    analytics: builder.mutation({
      query: (data: any) => ({
        url: "/api/dashboard/analytics/",
        method: "POST",
        body: data,
      }),
    }),
    deleteItem: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/",
        method: "DELETE",
        body: data,
      }),
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: "/auth/update/",
        method: "PATCH",
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
  useMultipleItemPdfMutation,
  useAnalyticsMutation,
  useDeleteItemMutation,
  useUpdateSubscriptionMutation,
} = appApi;
