import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/api/api";
import { ICommon, CommonResponse } from "@/ts/types/service/types";

const apiEndPoints = `/online-monitoring`;

export const onlineMonitoringServicePriceService = createApi({
  reducerPath: "online-monitoring-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["online-monitoring"],
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
      invalidatesTags: ["online-monitoring"],
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
      invalidatesTags: ["online-monitoring"],
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
      invalidatesTags: ["online-monitoring"],
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
      providesTags: ["online-monitoring"],
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
      providesTags: ["online-monitoring"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = onlineMonitoringServicePriceService;
