
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDtuAsjMGgYeJpAUxo8Szp_-lx76yDyjs8",
  authDomain: "qbuygreen-2185c.firebaseapp.com",
  projectId: "qbuygreen-2185c",
  storageBucket: "qbuygreen-2185c.appspot.com",
  messagingSenderId: "678656967091",
  appId: "1:678656967091:web:4117872d12f5c50b79cbc6",
  measurementId: "G-HMHGCFHDZG"

  
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});