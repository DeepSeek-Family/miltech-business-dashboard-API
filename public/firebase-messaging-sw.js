importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js");

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
  console.log("Background message:", payload);
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "New message",
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
