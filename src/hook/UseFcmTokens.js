import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../Config/firebase';
import firebase from '../../public/firebase-messaging-sw'
const UseFcmTokens = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] =
        useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker
                        .register('../../public/firebase-messaging-sw')
                        .then(function (registration) {
                            console.log('Registration successful, scope is:', registration.scope);
                        })
                        .catch(function (err) {
                            console.log('Service worker registration failed, error:', err);
                        });
                }
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebaseApp);

                    // Retrieve the notification permission status
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    // Check if permission is granted before retrieving the token
                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: "BO5TkDnPCb4x1cvcJn5OW2dmZbKljNrRxR5hzgGGvNqIQWeLzsKYNUBrSmhiQGFQrSUZW1mMhARCarsqmbKl43k"
                        });

                        console.log({ currentToken }, 'GOT TOKENNN')
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

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus };
}

export default UseFcmTokens