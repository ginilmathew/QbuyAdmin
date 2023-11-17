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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react"
import type { NextComponentType } from 'next'

// import PushNotificationLayout from '@/components/PushNotificationLayout';
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




	return <main className={poppins.className}>

		{isLoading && showHeader && (
			<Stack sx={{ width: '100%', color: 'grey.500' }} >
				<LinearProgress color="success" />
			</Stack>
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
