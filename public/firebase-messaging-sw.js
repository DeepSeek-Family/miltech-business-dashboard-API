// Firebase compat build — keep version aligned with `firebase` in package.json.
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyCS1lgyDYsx5nD4E-LIMlhjWBuR9r6UmVQ",
  authDomain: "miltech-c3007.firebaseapp.com",
  projectId: "miltech-c3007",
  storageBucket: "miltech-c3007.appspot.com",
  messagingSenderId: "593611426236",
  appId: "1:593611426236:web:e0de37f61c0beffa8083b9",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "New message",
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
