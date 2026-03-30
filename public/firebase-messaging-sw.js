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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);
  
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "New message",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.messageId || "notification",
    requireInteraction: payload.notification?.requireInteraction || false,
    data: payload.data || {},
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.title);
  event.notification.close();

  // Get the click action URL if available
  const clickedNotification = event.notification;
  const urlToOpen = clickedNotification.data?.link || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab with the target URL
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
