
import { postData } from '@/CustomAxios';
import UserContext from '@/helpers/user';
import { firebase, getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useContext, useEffect } from 'react';





const firebaseConfig = {
  apiKey: "AIzaSyDtuAsjMGgYeJpAUxo8Szp_-lx76yDyjs8",
  authDomain: "qbuygreen-2185c.firebaseapp.com",
  projectId: "qbuygreen-2185c",
  storageBucket: "qbuygreen-2185c.appspot.com",
  messagingSenderId: "678656967091",
  appId: "1:678656967091:web:4117872d12f5c50b79cbc6",
  measurementId: "G-HMHGCFHDZG"

};
initializeApp(firebaseConfig);
// const messaging = getMessaging();

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const messaging = getMessaging(app);


export const requestForToken = (user) => {
  console.log({ user: user }, 'GOT USER')

  Notification.requestPermission().then(async (permission) => {



    if (permission === "granted") {
      const app = initializeApp(firebaseConfig)
      const messaging = getMessaging(app)
      const messag = getMessaging();
      onMessageListener(messag)
      return getToken(messaging, { vapidKey: "BO5TkDnPCb4x1cvcJn5OW2dmZbKljNrRxR5hzgGGvNqIQWeLzsKYNUBrSmhiQGFQrSUZW1mMhARCarsqmbKl43k" })
        .then(async (currentToken) => {
          console.log({ currentToken })
          if (currentToken) {
            let data = {
              id: user?._id,
              token: currentToken 
            }
            try {
              await postData('auth/update-webtoken', data)
            } catch (err) {
              console.log({ err })
            }
          }
        })
        .catch((err) => {

        })

    } else {
      console.log('PERMISSION DENIED')
    }
  })
}


export const onMessageListener = (messaging) =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });