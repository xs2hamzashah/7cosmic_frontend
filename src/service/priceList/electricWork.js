import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/electric-work`;

const TOKEN = localStorage.getItem("accessToken");

export const electricWorkPriceService = createApi({
  reducerPath: "electric-work-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["electric-work"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["electric-work"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["electric-work"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["electric-work"],
    }),
    all: query({
      query: () => {
        return {
          url: `${apiEndPoints}/my_electrical_works/`,
          method: "GET",
        };
      },
      providesTags: ["electric-work"],
      transformResponse: (value) => {
        return value.electric_works;
      },
    }),
    single: query({
      query: ({ id }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "GET",
        };
      },
      providesTags: ["electric-work"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = electricWorkPriceService;
