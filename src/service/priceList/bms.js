import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/bms`;

const TOKEN = localStorage.getItem("accessToken");

export const bmsPriceApiService = createApi({
  reducerPath: "bms-price",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/pricelist`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["bms"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["bms"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["bms"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["bms"],
    }),
    all: query({
      query: () => {
        return {
          url: `${apiEndPoints}/my_bms/`,
          method: "GET",
        };
      },
      providesTags: ["bms"],
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
      providesTags: ["bms"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = bmsPriceApiService;
