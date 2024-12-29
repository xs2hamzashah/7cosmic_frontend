import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/mechanical-work`;

const TOKEN = localStorage.getItem("accessToken");

export const mechanicalWorkPriceService = createApi({
  reducerPath: "mechanical-work-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["mechanical-work"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["mechanical-work"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["mechanical-work"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["mechanical-work"],
    }),
    all: query({
      query: () => {
        return {
          url: `${apiEndPoints}`,
          method: "GET",
        };
      },
      providesTags: ["mechanical-work"],
      transformResponse: (value) => {
        return value.mechanical_works;
      },
    }),
    single: query({
      query: ({ id }) => {
        return {
          url: `${apiEndPoints}/${id}`,
          method: "GET",
        };
      },
      providesTags: ["mechanical-work"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = mechanicalWorkPriceService;
