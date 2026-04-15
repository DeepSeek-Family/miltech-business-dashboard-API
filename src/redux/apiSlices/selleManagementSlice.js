import { api } from "../api/baseApi";

export const selleManagementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET digital card with promotions
    // ---------------------------------------
    findDigitalCard: builder.query({
      query: (cardCode) => ({
        url: `/add-promotion/find?cardCode=${cardCode}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),

    // ---------------------------------------
    // POST request approval for promotion
    // ---------------------------------------
    requestPromotionApproval: builder.mutation({
      query: (body) => ({
        url: `/sell/promotion/request-approval`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response,
      invalidatesTags: ["sellManagement"],
    }),

    // ---------------------------------------
    // GET merchants list
    // ---------------------------------------
    getMerchants: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/sell/merchant?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),

    // ---------------------------------------
    // GET today's sales/transactions
    // ---------------------------------------
    getTodaysSells: builder.query({
      query: ({ page = 1, limit = 10, month = "", searchTerm = "" } = {}) => {
        let url = `/sell/merchant?page=${page}&limit=${limit}`;

        if (month) {
          url += `&month=${encodeURIComponent(month)}`;
        }

        if (searchTerm) {
          url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["sellManagement"],
      refetchOnMountOrArgChange: true,
    }),

    // ---------------------------------------
    // GET customers list
    // ---------------------------------------
    getCustomers: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) => {
        const url = `/sell/customer?page=${page}&limit=${limit}`;
        return {
          url: searchTerm
            ? `${url}&searchTerm=${encodeURIComponent(searchTerm)}`
            : url,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["sellManagement"],
    }),

    // ---------------------------------------
    // GET recent customers list
    // ---------------------------------------
    getRecentCustomers: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) => {
        const url = `/sell/recent-new/customer?page=${page}&limit=${limit}`;
        return {
          url: searchTerm
            ? `${url}&searchTerm=${encodeURIComponent(searchTerm)}`
            : url,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["sellManagement"],
    }),

    // ---------------------------------------
    // POST checkout/complete transaction
    // ---------------------------------------
    checkoutTransaction: builder.mutation({
      query: (body) => ({
        url: `/sell/checkout`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response,
      invalidatesTags: ["sellManagement"],
    }),

    // ---------------------------------------
    // GET user transactions
    // ---------------------------------------
    getUserTransactions: builder.query({
      query: (userId) => ({
        url: `/sell/transactions/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["sellManagement"],
    }),

    // ---------------------------------------
    // GET customer tier information
    // ---------------------------------------
    getCustomerTier: builder.query({
      query: (customerId) => ({
        url: `/mercent-customer/customers/${customerId}/tier`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["sellManagement"],
    }),

    // ---------------------------------------
    // GET export customers as Excel
    // ---------------------------------------
    exportCustomers: builder.query({
      query: () => ({
        url: `/sell/customer/export`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useLazyFindDigitalCardQuery,
  useRequestPromotionApprovalMutation,
  useGetMerchantsQuery,
  useGetTodaysSellsQuery,
  useGetCustomersQuery,
  useCheckoutTransactionMutation,
  useGetUserTransactionsQuery,
  useGetCustomerTierQuery,
  useLazyExportCustomersQuery,
  useGetRecentCustomersQuery,
} = selleManagementApi;
