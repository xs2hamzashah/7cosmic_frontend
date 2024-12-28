import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/api/api";
import {
  IMechanicalWork,
  IMechanicalWorkResponse,
} from "@/ts/types/service/types";

const apiEndPoints = `/mechanical-work`;

export const mechanicalWorkPriceService = createApi({
  reducerPath: "mechanical-work-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["mechanical-work"],
  endpoints: ({ mutation, query }) => ({
    create: mutation<IMechanicalWorkResponse, Omit<IMechanicalWork, "id">>({
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
      invalidatesTags: ["mechanical-work"],
    }),
    edit: mutation<IMechanicalWorkResponse, IMechanicalWork>({
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
      invalidatesTags: ["mechanical-work"],
    }),
    delete: mutation<IMechanicalWorkResponse, { id: string }>({
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
      invalidatesTags: ["mechanical-work"],
    }),
    all: query<IMechanicalWork[], { id: string }>({
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
      providesTags: ["mechanical-work"],
      transformResponse: (value: any) => {
        return value.mechanical_works;
      },
    }),
    single: query<IMechanicalWork, { id: string }>({
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
