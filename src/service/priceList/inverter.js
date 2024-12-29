import { API_URL } from "../../api/request";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiEndPoints = `/inverter`;

const TOKEN = localStorage.getItem("accessToken");
export const inverterPriceService = createApi({
  reducerPath: "inverter-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["inverter-price"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["inverter-price"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/inverter/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["inverter-price"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["inverter-price"],
    }),
    all: query({
      query: ({ page = 1 }) => {
        return {
          url: `/inverter/my_inverters/?page=${page}`,
          method: "GET",
        };
      },
      providesTags: ["inverter-price"],
      transformResponse: (value) => {
        return value.results;
      },
    }),
    single: query({
      query: ({ id }) => {
        return {
          // headers: {
          //   "Content-type": "application/json",
          //   // "Authorization": `Bearer ${token}`
          // },
          url: `${apiEndPoints}/${id}/`,
          method: "GET",
        };
      },
      providesTags: ["inverter-price"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = inverterPriceService;
