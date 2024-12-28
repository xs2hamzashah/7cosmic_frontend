import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/api/api";
import { ICivilWork, CivilWorkResponse } from "@/ts/types/service/types";

const apiEndPoints = `/civil-work`;

export const civilWorkPriceService = createApi({
  reducerPath: "civil-work-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["civil-work"],
  endpoints: ({ mutation, query }) => ({
    create: mutation<CivilWorkResponse, Omit<ICivilWork, "id">>({
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
      invalidatesTags: ["civil-work"],
    }),
    edit: mutation<CivilWorkResponse, ICivilWork>({
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
      invalidatesTags: ["civil-work"],
    }),
    delete: mutation<CivilWorkResponse, { id: string }>({
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
      invalidatesTags: ["civil-work"],
    }),
    all: query<ICivilWork[], { id: string }>({
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
      providesTags: ["civil-work"],
      transformResponse: (value: any) => {
        return value.civil_works;
      },
    }),
    single: query<ICivilWork, { id: string }>({
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
      providesTags: ["civil-work"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = civilWorkPriceService;
