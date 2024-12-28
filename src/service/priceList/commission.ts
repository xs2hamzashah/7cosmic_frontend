import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  IProfitCommission,
  ProfitCommissionResponse,
} from "@/ts/types/service/types";
import { API_URL } from "@/api/api";

const apiEndPoints = `/commission`;

export const commissionPriceService = createApi({
  reducerPath: "commission-price",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ["commission"],
  endpoints: ({ mutation, query }) => ({
    create: mutation<ProfitCommissionResponse, Omit<IProfitCommission, "id">>({
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
      invalidatesTags: ["commission"],
    }),
    edit: mutation<ProfitCommissionResponse, IProfitCommission>({
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
      invalidatesTags: ["commission"],
    }),
    delete: mutation<ProfitCommissionResponse, { id: string }>({
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
      invalidatesTags: ["commission"],
    }),
    all: query<IProfitCommission[], { id: string }>({
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
      providesTags: ["commission"],
      transformResponse: (value: any) => {
        return value.records;
      },
    }),
    single: query<IProfitCommission, { id: string }>({
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
      providesTags: ["commission"],
    }),
  }),
});

export const {
  useCreateMutation,
  useDeleteMutation,
  useEditMutation,
  useAllQuery,
  useSingleQuery,
} = commissionPriceService;
