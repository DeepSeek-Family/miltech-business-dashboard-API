import { api } from "../api/baseApi";

const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/notifications`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Notifications"],
    }),
    getUnreadCount: builder.query({
      query: () => ({
        url: `/notifications`,
        method: "GET",
        params: { limit: 1 },
      }),
      providesTags: ["Notifications"],
    }),
    readNotification: builder.mutation({
      query: () => ({
        url: `/notifications/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useReadNotificationMutation,
} = notificationApi;

export { notificationApi };
