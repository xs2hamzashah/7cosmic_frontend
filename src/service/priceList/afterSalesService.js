import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/after-sales-service`;

export const afterSalesServicePriceService = createApi({
  reducerPath: "after-sales-service-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["after-sales-service"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["after-sales-service"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["after-sales-service"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}/${id}`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["after-sales-service"],
    }),
    all: query({
      query: () => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: apiEndPoints,
          method: "GET",
        };
      },
      providesTags: ["after-sales-service"],
      transformResponse: (value) => {
        return value.records;
      },
    }),
    single: query({
      query: ({ id }) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}/${id}`,
          method: "GET",
        };
      },
      providesTags: ["after-sales-service"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = afterSalesServicePriceService;
