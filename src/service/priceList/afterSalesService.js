import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/after-sales-service`;
const TOKEN = localStorage.getItem("accessToken");

export const afterSalesPricingApi = createApi({
  reducerPath: "after-sales-service-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["after-sales-service"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["after-sales-service"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["after-sales-service"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["after-sales-service"],
    }),
    all: query({
      query: () => {
        return {
          url: `${apiEndPoints}/my_after_sales_services/`,
          method: "GET",
        };
      },
      providesTags: ["after-sales-service"],
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
} = afterSalesPricingApi;
