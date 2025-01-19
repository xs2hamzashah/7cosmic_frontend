import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../api/request";

const TOKEN = localStorage.getItem("accessToken");
console.log("🚀 ~ TOKEN:", TOKEN);
export const panelPriceService = createApi({
  reducerPath: "panel-price",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/pricelist`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
  tagTypes: ["panel-price"],
  endpoints: ({ mutation, query }) => ({
    createPanel: mutation({
      query: (data) => {
        return {
          url: "/panel/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["panel-price"],
    }),
    editPanel: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/panel/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["panel-price"],
    }),
    deletePanel: mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/panel/${id}/`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["panel-price"],
    }),
    panels: query({
      query: ({ page = 1, limit = 10 }) => {
        return {
          url: `/panel/my_panels?page=${page}`,
          method: "GET",
        };
      },
      providesTags: ["panel-price"],
      transformResponse: (value) => {
        return value;
      },
    }),
    panel: query({
      query: ({ id }) => {
        return {
          url: `/panel/${id}/`,
          method: "GET",
        };
      },
      providesTags: ["panel-price"],
    }),
  }),
});

export const {
  useCreatePanelMutation,
  usePanelsQuery,
  useEditPanelMutation,
  useDeletePanelMutation,
} = panelPriceService;
