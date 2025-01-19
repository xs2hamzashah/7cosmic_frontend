import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const apiEndPoints = `/net-metering`;

const TOKEN = localStorage.getItem("accessToken");

export const netMeteringPriceService = createApi({
  reducerPath: "net-metering-price",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/pricelist`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["net-metering"],
  endpoints: ({ mutation, query }) => ({
    create: mutation({
      query: (data) => {
        return {
          url: `${apiEndPoints}/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["net-metering"],
    }),
    edit: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["net-metering"],
    }),
    delete: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `${apiEndPoints}/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["net-metering"],
    }),
    all: query({
      query: () => {
        return {
          url: `${apiEndPoints}/my_net_meterings/`,
          method: "GET",
        };
      },
      providesTags: ["net-metering"],
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
      providesTags: ["net-metering"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = netMeteringPriceService;
