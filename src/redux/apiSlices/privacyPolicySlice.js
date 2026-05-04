import { api } from "../api/baseApi";

export const privacyPolicyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET privacy policy
    // ---------------------------------------
    getPrivacyPolicy: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/disclaimers/merchant-privacy-policy?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["PrivacyPolicy"],
    }),
    // ---------------------------------------
    // UPDATE privacy policy
    // ---------------------------------------
    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: `/disclaimers/merchant-privacy-policy`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } =
  privacyPolicyApi;
