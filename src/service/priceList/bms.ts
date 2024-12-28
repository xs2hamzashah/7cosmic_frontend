import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/api/api";
import { ICommon, CommonResponse } from "@/ts/types/service/types";

const apiEndPoints = `/bms`;

export const bmsServicePriceService = createApi({
  reducerPath: "bms-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["bms"],
  endpoints: ({ mutation, query }) => ({
    create: mutation<CommonResponse, Omit<ICommon, "id">>({
      query: (data) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}`,
          method: "POST",
          body: data,
        } as FetchArgs;
      },
      invalidatesTags: ["bms"],
    }),
    edit: mutation<CommonResponse, ICommon>({
      query: ({ id, ...data }) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}/${id}`,
          method: "PUT",
          body: data,
        } as FetchArgs;
      },
      invalidatesTags: ["bms"],
    }),
    delete: mutation<CommonResponse, { id: string }>({
      query: ({ id, ...data }) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}/${id}`,
          method: "DELETE",
          body: data,
        } as FetchArgs;
      },
      invalidatesTags: ["bms"],
    }),
    all: query<ICommon[], { id: string }>({
      query: () => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: apiEndPoints,
          method: "GET",
        } as FetchArgs;
      },
      providesTags: ["bms"],
      transformResponse: (value: any) => {
        return value.records;
      },
    }),
    single: query<ICommon, { id: string }>({
      query: ({ id }) => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}/${id}`,
          method: "GET",
        } as FetchArgs;
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
} = bmsServicePriceService;
