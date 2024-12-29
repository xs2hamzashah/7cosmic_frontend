import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/battery`;
const TOKEN = localStorage.getItem("accessToken");

export const batteryPriceService = createApi({
  reducerPath: "battery-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["battery-price"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["battery-price"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/battery/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["battery-price"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["battery-price"],
    }),
    all: query({
      query: () => {
        return {
          url: `/battery/my_batteries/`,
          method: "GET",
        };
      },
      providesTags: ["battery-price"],
      transformResponse: (value) => {
        return value;
      },
    }),
    single: query({
      query: ({ id }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "GET",
        };
      },
      providesTags: ["battery-price"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = batteryPriceService;
