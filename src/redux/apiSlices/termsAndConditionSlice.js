import { api } from "../api/baseApi";

export const termsAndConditionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET terms and conditions
    // ---------------------------------------
    getTermsAndConditions: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/disclaimers/merchant-terms-and-conditions?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["TermsAndConditions"],
    }),
    // ---------------------------------------
    // UPDATE terms and conditions
    // ---------------------------------------
    updateTermsAndConditions: builder.mutation({
      query: (body) => ({
        url: `/disclaimers/merchant-terms-and-conditions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TermsAndConditions"],
    }),
  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionApi;
