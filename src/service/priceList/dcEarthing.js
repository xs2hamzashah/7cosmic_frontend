import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";
const apiEndPoints = `/dc-earthing`;

const TOKEN = localStorage.getItem("accessToken");

export const dcEarthingPriceApi = createApi({
  reducerPath: "dc-earthing-price",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/pricelist`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["dc-earthing"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["dc-earthing"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["dc-earthing"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["dc-earthing"],
    }),
    all: query({
      query: () => {
        return {
          url: `${apiEndPoints}/my_dc_earthings/`,
          method: "GET",
        };
      },
      providesTags: ["dc-earthing"],
      transformResponse: (value) => {
        return value;
      },
    }),
    single: query({
      query: ({ id }) => {
        return {
          url: `${apiEndPoints}/${id}`,
          method: "GET",
        };
      },
      providesTags: ["dc-earthing"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = dcEarthingPriceApi;
