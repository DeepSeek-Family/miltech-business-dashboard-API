import { messaging } from "../config/firebaseConfig";
import { getToken, isSupported, onMessage } from "firebase/messaging";

const SW_PATH = "/firebase-messaging-sw.js";

const VAPID_KEY =
  import.meta.env.VITE_FIREBASE_VAPID_KEY ||
  "BOgebeEZSqwM2VX5GIAQ071FfCVCvgn26_h6V-xS65uK76xiY9IlwMa_-M3Ifh-D1UMb4HyUsUf6t9tPJr7ed5Y";

/**
 * Generates a fallback device ID when FCM is not available
 */
function generateDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
    console.log("[Device] Generated new device ID:", deviceId);
  }
  return deviceId;
}

/**
 * Ensures the FCM service worker is registered and active, then returns that
 * registration for getToken(). Without this, getToken() often returns null on
 * localhost until the SW race is resolved.
 */
async function getFcmServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) {
    return undefined;
  }
  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return registration;
  } catch (e) {
    console.error("[FCM] Service worker registration failed:", e);
    return undefined;
  }
}

/**
 * Request notification permission if not already granted
 */
async function requestNotificationPermission() {
  try {
    if (!("Notification" in window)) {
      console.warn("[FCM] Notification API not supported");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.warn("[FCM] Notification permission previously denied");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("[FCM] Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Show a notification to the user
 */
export const showNotification = (title, options = {}) => {
  try {
    if (!("Notification" in window)) {
      console.warn("[Notification] API not supported");
      return;
    }

    if (Notification.permission !== "granted") {
      console.warn("[Notification] Permission not granted");
      return;
    }

    const notificationOptions = {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    };

    new Notification(title, notificationOptions);
    console.log("[Notification] Notification shown:", title);
  } catch (error) {
    console.error("[Notification] Error showing notification:", error);
  }
};

export const getFCMToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("[FCM] Messaging is not supported in this browser.");
      console.log("[Device] Falling back to device ID");
      return generateDeviceId();
    }

    if (!messaging) {
      console.error("[FCM] Firebase messaging is null (check firebaseConfig).");
      return generateDeviceId();
    }

    // Request notification permission if needed
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn("[FCM] Notification permission not granted.");
      return generateDeviceId();
    }

    // Register service worker
    const serviceWorkerRegistration = await getFcmServiceWorkerRegistration();

    const tokenOptions = {
      vapidKey: VAPID_KEY,
      ...(serviceWorkerRegistration && { serviceWorkerRegistration }),
    };

    let token = await getToken(messaging, tokenOptions);

    // Retry if token is empty (race condition with SW)
    if (!token && serviceWorkerRegistration) {
      await new Promise((r) => setTimeout(r, 500));
      token = await getToken(messaging, tokenOptions);
    }

    if (token) {
      localStorage.setItem("fcmToken", token);
      console.log("[FCM] Token retrieved successfully");
      return token;
    }

    console.warn(
      "[FCM] getToken returned empty — using fallback device ID",
    );
    return generateDeviceId();
  } catch (error) {
    console.error("[FCM] getFCMToken error:", error?.code, error?.message);
    console.log("[Device] Falling back to device ID due to error");
    return generateDeviceId();
  }
};

export const getStoredFCMToken = () => {
  const token = localStorage.getItem("fcmToken");
  if (token) {
    console.log("[FCM] Using stored FCM token");
    return token;
  }
  // Return device ID as fallback
  return generateDeviceId();
};

/**
 * Initialize foreground message handler
 * This displays notifications when the app is open/in focus
 */
export const setupForegroundMessageHandler = () => {
  try {
    if (!messaging) {
      console.warn("[FCM] Messaging not available for foreground handler");
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("[FCM] Foreground message received:", payload);

      const title = payload.notification?.title || "Notification";
      const options = {
        body: payload.notification?.body || "New message",
        icon: payload.notification?.icon || "/favicon.ico",
        tag: payload.messageId || "notification",
        data: payload.data || {},
      };

      // Show notification
      showNotification(title, options);

      // Additional handling based on data payload
      if (payload.data) {
        console.log("[FCM] Message data:", payload.data);
      }
    });

    console.log("[FCM] Foreground message handler initialized");
  } catch (error) {
    console.error("[FCM] Error setting up foreground handler:", error);
  }
};

export const clearFCMToken = () => {
  localStorage.removeItem("fcmToken");
};
