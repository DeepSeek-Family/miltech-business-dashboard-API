import { api } from "../api/baseApi";

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET stats
    // ---------------------------------------
    getStats: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/mercent/merchant-dashboard-report?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Tier"],
    }),

    // ---------------------------------------
    // GET Weekly Sell Report
    // ---------------------------------------
    getWeeklySellReport: builder.query({
      query: () => ({
        url: `/mercent/weekly-sell-report`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["Statistics"],
    }),

    // ---------------------------------------
    // GET Customer Chart
    // ---------------------------------------
    getCustomerChart: builder.query({
      query: ({ year }) => ({
        url: `/mercent/customer-chart?year=${year}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["CustomerChart"],
    }),
  }),
});

export const { useGetStatsQuery, useGetWeeklySellReportQuery, useGetCustomerChartQuery } = homeApi;
