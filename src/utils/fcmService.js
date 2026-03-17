import { messaging } from "../config/firebaseConfig";
import { getToken } from "firebase/messaging";

export const getFCMToken = async () => {
  try {
    console.log("🔧 getFCMToken called");
    console.log("messaging object:", messaging);

    if (!messaging) {
      console.error("❌ Firebase messaging is NULL");
      return null;
    }

    console.log("✓ Messaging initialized");

    // Request notification permission
    if (Notification.permission !== "granted") {
      console.log("📢 Requesting notification permission...");
      const permission = await Notification.requestPermission();
      console.log("Permission result:", permission);
      if (permission !== "granted") {
        console.warn("⚠️  Permission denied");
        return null;
      }
    }

    console.log("✓ Notification permission granted");
    console.log("🔑 VAPID Key:", import.meta.env.VITE_FIREBASE_VAPID_KEY ? "✓ Set" : "❌ Missing");

    // Get FCM token
    console.log("📡 Requesting getToken...");
    const token = await getToken(messaging, {
      vapidKey: "BOgebeEZSqwM2VX5GIAQ071FfCVCvgn26_h6V-xS65uK76xiY9IlwMa_-M3Ifh-D1UMb4HyUsUf6t9tPJr7ed5Y",
    });

    if (token) {
      console.log("✅ FCM Token received:", token.substring(0, 40) + "...");
      localStorage.setItem("fcmToken", token);
      return token;
    } else {
      console.error("❌ getToken returned null");
      return null;
    }
  } catch (error) {
    console.error("❌ Error in getFCMToken:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    return null;
  }
};

export const getStoredFCMToken = () => {
  return localStorage.getItem("fcmToken");
};

export const clearFCMToken = () => {
  localStorage.removeItem("fcmToken");
};
