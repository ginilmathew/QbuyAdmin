import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDtuAsjMGgYeJpAUxo8Szp_-lx76yDyjs8",
    authDomain: "qbuygreen-2185c.firebaseapp.com",
    projectId: "qbuygreen-2185c",
    storageBucket: "qbuygreen-2185c.appspot.com",
    messagingSenderId: "678656967091",
    appId: "1:678656967091:web:4117872d12f5c50b79cbc6",
    measurementId: "G-HMHGCFHDZG"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;