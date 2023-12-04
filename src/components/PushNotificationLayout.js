
import React, { useState, useEffect, useContext } from "react";
import { getMessaging, onMessage } from 'firebase/messaging';
import { requestForToken, onMessageListener } from '../Config/firebase';
import { toast } from "react-toastify";
import UserContext from "@/helpers/user";
import { useSession } from "next-auth/react";
import  UseFcmTokens  from '../hook/UseFcmTokens'
import firebaseApp from '../Config/firebase';

function PushNotificationLayout({ children }) {

    // const { data: session, status } = useSession()
    // const [firebase, setFirebase] = useState({ title: '', body: '' });
    // const userContext = useContext(UserContext);



    // const Msg = ({ closeToast, toastProps }) => (
    //     <div>
    //         {firebase?.title} {toastProps.position}
    //         <p>{firebase.body}</p>
    //         <button onClick={closeToast}>Close</button>
    //     </div>
    // )

    // async function requestPermission() {
    //   requestForToken(session?.user);

    //     onMessageListener()
    //         .then((payload) => {
    //             console.log({ payload },'PAYLOAD')
    //             setFirebase({ title: payload?.firebase?.title, body: payload?.notification?.body });
    //             toast(Msg, {
    //                 toastId: "customId"
    //             });
    //         })
    //         .catch((err) => console.log('failed: THEIR IS AN ERROR', err));
    // }

    // useEffect(() => {
    //     requestPermission()
    // }, [])

    const { fcmToken, notificationPermissionStatus } = UseFcmTokens();
    // Use the token as needed
    fcmToken && console.log('FCM token:', fcmToken);
    // useEffect(() => {
    //     if ('serviceWorker' in navigator) {
    //       navigator.serviceWorker
    //         .register('../../public/ firebase-messaging-sw')
    //         .then(function (registration) {
    //           console.log('Registration successful, scope is:', registration.scope);
    //         })
    //         .catch(function (err) {
    //           console.log('Service worker registration failed, error:', err);
    //         });
    //     }
    //   }, []); 

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground push notification received:', payload);
                // Handle the received push notification while the app is in the foreground
                // You can display a notification or update the UI based on the payload
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, []);
    return (
        <>
            {children}
        </>
    );
}

export default PushNotificationLayout;