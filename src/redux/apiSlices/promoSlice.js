import { api } from "../api/baseApi";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET promo details
    // ---------------------------------------
    getPromoDetails: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/promo-merchant/merchants?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Promo"],
    }),

    // ---------------------------------------
    // PATCH toggle promo status
    // ---------------------------------------
    togglePromoStatus: builder.mutation({
      query: (id) => ({
        url: `/promo-merchant/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // PATCH update promotion
    // ---------------------------------------
    updatePromotion: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/promo-merchant/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // POST create promotion
    // ---------------------------------------
    createPromotion: builder.mutation({
      query: (formData) => ({
        url: `/promo-merchant`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // DELETE promotion
    // ---------------------------------------
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/promo-merchant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // POST send notification
    // ---------------------------------------
    sendNotification: builder.mutation({
      query: (formData) => ({
        url: `/push-notification/merchant/notify`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Promo"],
    }),
  }),
});

export const {
  useGetPromoDetailsQuery,
  useTogglePromoStatusMutation,
  useUpdatePromotionMutation,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
  useSendNotificationMutation,
} = customerApi;
