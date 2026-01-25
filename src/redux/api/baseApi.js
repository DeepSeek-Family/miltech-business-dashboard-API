import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ---------------------------------------------
// TOKEN SERVICE (Combined)
// ---------------------------------------------
const tokenService = {
  getAccessToken() {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  },

  getRefreshToken() {
    try {
      return localStorage.getItem("refreshToken");
    } catch {
      return null;
    }
  },

  saveTokens(accessToken, refreshToken) {
    try {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } catch {}
  },

  clear() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch {}
  },
};

// ---------------------------------------------
// BASE API SETUP
// ---------------------------------------------
const baseUrl = "http://10.10.7.8:5004/api/v1";
// const baseUrl = "https://44kb593x-5004.inc1.devtunnels.ms/api/v1";

// Attach Access Token to every request
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Skip if Authorization header is already set (for resetToken, etc.)
    if (headers.has("Authorization")) {
      return headers;
    }

    const token = tokenService.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Intercept 401 → logout + redirect
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    tokenService.clear();

    const currentPath = window.location.pathname;
    if (!currentPath.startsWith("/auth")) {
      window.location.replace("/auth/login");
    }
  }
  return result;
};

// ---------------------------------------------
// MAIN API EXPORT
// ---------------------------------------------
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Profile",
    "Customer",
    "Merchant",
    "Statistics",
    "Tier",
    "CustomerChart",
    "Promo",
    "Order",
    "Product",
    "PrivacyPolicy",
    "TermsAndConditions",
    "CustomerReport",
    "Notifications",
    "AuditLog",
    "SellManagement",
    "User",
  ],
  endpoints: () => ({}),
});

// export const imageUrl = "http://206.189.231.81:5000";
export const imageUrl = "http://206.189.231.81:5000";
