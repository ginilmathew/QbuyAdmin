import '@/styles/globals.css'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/Widgets/Header'), { ssr: false });
const UserProvider = dynamic(() => import('@/helpers/user/UserContext'), { ssr: false });
const ProtectedRoute = dynamic(() => import('@/Routes/protectedRoutes'), { ssr: false });
const LinearProgress = dynamic(() => import('@mui/material/LinearProgress'), { ssr: false });
const Stack = dynamic(() => import('@mui/material/Stack'), { ssr: false });

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google';
import React, { useEffect } from 'react';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react"
import type { NextComponentType } from 'next'
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/utilities/firebase/firebase';
// import useFcmToken from '@/utilities/hooks/useFcmToken';

import PushNotificationLayout from '@/components/PushNotificationLayout';
// import VendorStatusProvider from '@/helpers/shippingStatus/VendorStatusContext';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['200', '600', '700']
})

type CustomAppProps = AppProps & {
	Component: NextComponentType & { auth?: boolean } // add auth type
}

export default function App({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {

	const router = useRouter();
	const showHeader = (router.pathname === '/login' || router.pathname === "/404") ? false : true;

	const [isLoading, setLoading] = React.useState(false);

	useEffect(() => {
		const handleStart = () => setLoading(true);
		const handleComplete = () => setLoading(false);

		Router.events.on('routeChangeStart', handleStart);
		Router.events.on('routeChangeComplete', handleComplete);
		Router.events.on('routeChangeError', handleComplete);
		return () => {
			Router.events.off('routeChangeStart', handleStart);
			Router.events.off('routeChangeComplete', handleComplete);
			Router.events.off('routeChangeError', handleComplete);
		};
	}, []);

	// const { fcmToken,notificationPermissionStatus, retrieveToken } = useFcmToken();


	// console.log({fcmToken, notificationPermissionStatus})


	useEffect(() => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		  const messaging = getMessaging(firebaseApp);
		  const unsubscribe = onMessage(messaging, (payload) => {
			console.log('Foreground push notification received:', payload);
			const notificationOptions = {
				body: payload?.notification?.body,
				icon: 'images/panda.png',
				sound:'default'
			
			  };
			//new Notification(payload?.notification?.title, notificationOptions);
			toast(({ closeToast }) => <div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>{payload?.notification?.title}</div>
				<div>{payload?.notification?.body}</div>

			</div>);
			// Handle the received push notification while the app is in the foreground
			// You can display a notification or update the UI based on the payload
		  });
		  return () => {
			unsubscribe(); // Unsubscribe from the onMessage event
		  };
		}
	  }, []);

	  const handleGetFirebaseToken = () => {
		retrieveToken()
	  };





	return <main className={poppins.className}>

		{isLoading && showHeader && (
			<Stack sx={{ width: '100%', color: 'grey.500' }} >
				<LinearProgress color="success" />
			</Stack>
		)}
		{notificationPermissionStatus !== "granted" && (
          <div className="notification-banner">
            <span>The app needs permission to</span>
            <a
              href="#"
              className="notification-banner-link"
              onClick={handleGetFirebaseToken}
            >
              enable push notifications.
            </a>
          </div>
        )}
		<SessionProvider session={session}>
			<UserProvider>
					{Component.auth ? (
						<Component {...pageProps} />
					) : (
						<ProtectedRoute>
					
								<UserProvider>
									{/* <PushNotificationLayout> */}
									<Header />
									<Component {...pageProps} />
									{/* </PushNotificationLayout> */}
								</UserProvider>
						
						</ProtectedRoute>
					)}
					<ToastContainer />
			</UserProvider>
		</SessionProvider>
	</main>


}
