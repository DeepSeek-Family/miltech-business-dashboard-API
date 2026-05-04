import { api } from "../api/baseApi";

export const userManagementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET user list
    // ---------------------------------------
    getUserList: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/merchant-user/users?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["User"],
    }),
    // ---------------------------------------
    // DELETE merchant
    // ---------------------------------------
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/merchant-user/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    // ---------------------------------------
    // UPDATE merchant approval status
    // ---------------------------------------
    updateUserApprovalStatus: builder.mutation({
      query: ({ id, approveStatus }) => ({
        url: `/usermanagement/merchantrole/${id}`,
        method: "PATCH",
        body: { approveStatus },
      }),
      invalidatesTags: ["User"],
    }),
    // ---------------------------------------
    // UPDATE merchant status (active/inactive)
    // ---------------------------------------
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/merchant-user/users/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),
    // ---------------------------------------
    // CREATE new user
    // ---------------------------------------
    createUser: builder.mutation({
      query: (userData) => ({
        url: `/merchant-user/create-user`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    // ---------------------------------------
    // UPDATE user
    // ---------------------------------------
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/merchant-user/users/${id}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserListQuery,
  useDeleteUserMutation,
  useUpdateUserApprovalStatusMutation,
  useUpdateUserStatusMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userManagementApi;
