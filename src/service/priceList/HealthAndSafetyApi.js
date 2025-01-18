import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/hse-equipment`;

const TOKEN = localStorage.getItem("accessToken");

export const HealthAndSafetyApi = createApi({
  reducerPath: "hse-equipment-price",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/pricelist`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["hse-equipment"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["hse-equipment"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["hse-equipment"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["hse-equipment"],
    }),
    all: query({
      query: () => {
        return {
          url: apiEndPoints,
          method: "GET",
        };
      },
      providesTags: ["hse-equipment"],
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
      providesTags: ["hse-equipment"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = HealthAndSafetyApi;
