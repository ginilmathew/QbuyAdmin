import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../firebase/firebase';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('');

    const retrieveToken = async () => {
        try {
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
  
            // Retrieve the notification permission status
            const permission = await Notification.requestPermission();
            setNotificationPermissionStatus(permission);
  
            // Check if permission is granted before retrieving the token
            if (permission === 'granted') {
              const currentToken = await getToken(messaging, {
                vapidKey:
                  'BO5TkDnPCb4x1cvcJn5OW2dmZbKljNrRxR5hzgGGvNqIQWeLzsKYNUBrSmhiQGFQrSUZW1mMhARCarsqmbKl43k',
              });
              if (currentToken) {
                setToken(currentToken);
              } else {
                console.log(
                  'No registration token available. Request permission to generate one.'
                );
              }
            }
          }
        } catch (error) {
          console.log('An error occurred while retrieving token:', error);
        }
      };

      const generateToken = async() => {
        const messaging = getMessaging(firebaseApp);
        const currentToken = await getToken(messaging, {
            vapidKey:
              'BO5TkDnPCb4x1cvcJn5OW2dmZbKljNrRxR5hzgGGvNqIQWeLzsKYNUBrSmhiQGFQrSUZW1mMhARCarsqmbKl43k',
          });
          if (currentToken) {
            setToken(currentToken);
          } else {
            console.log(
              'No registration token available. Request permission to generate one.'
            );
          }
      }

      useEffect(() => {
        if(window.Notification?.permission === "granted"){
            generateToken()
            setNotificationPermissionStatus("granted");
        }
        // if (
        //   window.Notification?.permission === "granted"
        // ) {
        //     retrieveToken();
        // }
      }, []);

  return { fcmToken: token, notificationPermissionStatus, retrieveToken };
};

export default useFcmToken;