import { api } from "../api/baseApi";

export const customerReportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET Report
    // ---------------------------------------
    getCustomerReport: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/business-customer?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["CustomerReport"],
    }),
    // ---------------------------------------
    // GET Customer Name List for Filter
    // ---------------------------------------
    getCustomerNameList: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/business-customer?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["CustomerReport"],
    }),
    // ---------------------------------------
    // EXPORT Report
    // ---------------------------------------
    exportCustomerReport: builder.mutation({
      query: (queryParams) => {
        const params = new URLSearchParams();
        if (queryParams && Array.isArray(queryParams)) {
          queryParams.forEach((param) => {
            params.append(param.name, param.value);
          });
        }
        return {
          url: `/report-analytics/business-customer/export${
            params.toString() ? "?" + params.toString() : ""
          }`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
      invalidatesTags: ["CustomerReport"],
    }),
  }),
});

export const {
  useGetCustomerReportQuery,
  useExportCustomerReportMutation,
  useGetCustomerNameListQuery,
} = customerReportApi;
