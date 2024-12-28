import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/api/api";
import { IElectricWork, ElectricWorkResponse } from "@/ts/types/service/types";

const apiEndPoints = `/electric-work`;

export const electricWorkPriceService = createApi({
  reducerPath: "electric-work-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["electric-work"],
  endpoints: ({ mutation, query }) => ({
    create: mutation<ElectricWorkResponse, Omit<IElectricWork, "id">>({
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
      invalidatesTags: ["electric-work"],
    }),
    edit: mutation<ElectricWorkResponse, IElectricWork>({
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
      invalidatesTags: ["electric-work"],
    }),
    delete: mutation<ElectricWorkResponse, { id: string }>({
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
      invalidatesTags: ["electric-work"],
    }),
    all: query<IElectricWork[], { id: string }>({
      query: () => {
        return {
          headers: {
            "Content-type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
          url: `${apiEndPoints}`,
          method: "GET",
        } as FetchArgs;
      },
      providesTags: ["electric-work"],
      transformResponse: (value: any) => {
        return value.electric_works;
      },
    }),
    single: query<IElectricWork, { id: string }>({
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
