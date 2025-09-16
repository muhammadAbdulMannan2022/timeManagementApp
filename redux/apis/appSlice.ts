import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

// wrap fetchBaseQuery so we can inject token
const baseQuery = fetchBaseQuery({
  baseUrl: "https://d134ef4fda6c.ngrok-free.app",
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
  endpoints: (builder) => ({
    boilerPlate: builder.query({
      query: () => "/api/tasks/19/update/",
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
    // calender
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
    // get boiler plate
    getBoilerPlate: builder.query({
      query: () => "/api/boiler-plate/",
    }),
  }),
});

// auto-generated hooks
export const {
  useTasksMutation,
  useGetUserQuery,
  useBoilerPlateQuery,
  useGetDatesQuery,
  useGetDataBySingleDateMutation,
  useGetSingleByIdQuery,
  useGetBoilerPlateQuery,
} = appApi;
