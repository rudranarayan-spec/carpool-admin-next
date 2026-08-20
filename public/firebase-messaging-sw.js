importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCkmu9h9wdONo7ZiFU0wNTnH5XLBrrQ2aY",
  authDomain: "carpool-6217a.firebaseapp.com",
  projectId: "carpool-6217a",
  storageBucket: "carpool-6217a.firebasestorage.app",
  messagingSenderId: "402294989554",
  appId: "1:402294989554:web:1c341a37d46cb8d833a66b",
});

const messaging = firebase.messaging();

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Carpooling Admin";

  const options = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    badge: "/logo.png",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

// Focus open dashboard tab or open a new one on notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/dashboard") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/dashboard");
      }
    })
  );
});