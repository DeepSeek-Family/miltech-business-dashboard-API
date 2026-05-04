import { api } from "../api/baseApi";

export const merchantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET tier
    // ---------------------------------------
    getTier: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/tier?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Tier"],
    }),

    // ---------------------------------------
    // ADD tier
    // ---------------------------------------
    addTier: builder.mutation({
      query: (body) => ({
        url: `/tier`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tier"],
    }),

    // ---------------------------------------
    // UPDATE tier
    // ---------------------------------------
    updateTier: builder.mutation({
      query: ({ id, body }) => ({
        url: `/tier/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tier"],
    }),

    // ---------------------------------------
    // DELETE tier
    // ---------------------------------------
    deleteTier: builder.mutation({
      query: (id) => ({
        url: `/tier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tier"],
    }),

    // ---------------------------------------
    // GET all audit logs
    // ---------------------------------------
    getAllAuditLog: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/audit/audit-logs/user?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["AuditLog"],
    }),
  }),
});

export const {
  useGetTierQuery,
  useAddTierMutation,
  useUpdateTierMutation,
  useDeleteTierMutation,
  useGetAllAuditLogQuery,
} = merchantApi;
