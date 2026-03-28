import { messaging } from "../config/firebaseConfig";
import { getToken, isSupported } from "firebase/messaging";

const SW_PATH = "/firebase-messaging-sw.js";

const VAPID_KEY =
  import.meta.env.VITE_FIREBASE_VAPID_KEY ||
  "BOgebeEZSqwM2VX5GIAQ071FfCVCvgn26_h6V-xS65uK76xiY9IlwMa_-M3Ifh-D1UMb4HyUsUf6t9tPJr7ed5Y";

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

export const getFCMToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("[FCM] Messaging is not supported in this browser.");
      return null;
    }

    if (!messaging) {
      console.error("[FCM] Firebase messaging is null (check firebaseConfig).");
      return null;
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("[FCM] Notification permission denied.");
        return null;
      }
    }

    const serviceWorkerRegistration = await getFcmServiceWorkerRegistration();

    const tokenOptions = {
      vapidKey: VAPID_KEY,
      ...(serviceWorkerRegistration && { serviceWorkerRegistration }),
    };

    let token = await getToken(messaging, tokenOptions);

    if (!token && serviceWorkerRegistration) {
      await new Promise((r) => setTimeout(r, 400));
      token = await getToken(messaging, tokenOptions);
    }

    if (token) {
      localStorage.setItem("fcmToken", token);
      return token;
    }

    console.error(
      "[FCM] getToken returned empty — confirm Web Push key in Firebase Console matches VITE_FIREBASE_VAPID_KEY / VAPID in code.",
    );
    return null;
  } catch (error) {
    console.error("[FCM] getFCMToken error:", error?.code, error?.message, error);
    return null;
  }
};

export const getStoredFCMToken = () => {
  return localStorage.getItem("fcmToken");
};

export const clearFCMToken = () => {
  localStorage.removeItem("fcmToken");
};
