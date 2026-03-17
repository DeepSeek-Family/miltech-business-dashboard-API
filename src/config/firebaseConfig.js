import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

console.log("🔥 Firebase Config Loading...");

const firebaseConfig = {
  apiKey: "AIzaSyCS1lgyDYsx5nD4E-LIMlhjWBuR9r6UmVQ",
  authDomain: "miltech-c3007.firebaseapp.com",
  projectId: "miltech-c3007",
  storageBucket: "miltech-c3007.appspot.com",
  messagingSenderId: "593611426236",
  appId: "1:593611426236:web:e0de37f61c0beffa8083b9",
};

console.log("✓ Config object created");

let messaging = null;

try {
  console.log("🔧 Initializing Firebase app...");
  const app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized:", app.name);

  console.log("📱 Getting messaging instance...");
  messaging = getMessaging(app);
  console.log("✅ Messaging instance created:", messaging ? "OK" : "NULL");
} catch (error) {
  console.error("❌ Firebase error:", error);
  console.error("Error message:", error.message);
  console.error("Error code:", error.code);
}

console.log("📤 Exporting messaging:", messaging ? "✅ OK" : "❌ NULL");

export { messaging };
