import { api } from "../api/baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // OTP VERIFY PHONE
    // Returns: { accessToken, resetToken }
    // ---------------------------------------
    otpVerify: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => ({
        accessToken: response?.data?.accessToken,
        resetToken: response?.data?.resetToken,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ---------------------------------------
    // RESEND OTP
    // ---------------------------------------
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    // ---------------------------------------
    // LOGIN
    // ---------------------------------------
    login: builder.mutation({
      query: (credentials) => {
        const body = {
          identifier: credentials.identifier,
          password: credentials.password,
          device: credentials.device,
        };
        if (credentials.fcmToken) {
          body.fcmToken = credentials.fcmToken;
        }
        return {
          url: "/auth/login",
          method: "POST",
          body,
        };
      },
      transformResponse: (data) => data,

      invalidatesTags: ["Profile"],
    }),

    // ---------------------------------------
    // REGISTER (SIGN UP)
    // ---------------------------------------
    register: builder.mutation({
      query: (payload) => ({
        url: "/user",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response?.data ?? response,
    }),

    // ---------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // ---------------------------------------
    // RESET PASSWORD
    // Uses resetToken in Authorization header
    // Accepts: { newPassword, confirmPassword, headers }
    // ---------------------------------------
    resetPassword: builder.mutation({
      query: (data) => {
        const { headers, ...body } = data;
        const finalHeaders = headers || {};

        return {
          url: "/auth/reset-password",
          method: "POST",
          body,
          headers: finalHeaders,
        };
      },
    }),

    // ---------------------------------------
    // CHANGE PASSWORD
    // ---------------------------------------
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,
    }),

    // ---------------------------------------
    // UPDATE PROFILE
    // ---------------------------------------
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ---------------------------------------
    // GET PROFILE
    // ---------------------------------------
    profile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),

      transformResponse: (response) =>
        response?.data ?? response?.user ?? response,

      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useResendOtpMutation,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authApi;
