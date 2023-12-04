import Head from 'next/head'
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react'
import { useSession } from "next-auth/react"
//import Login from './login'
//import Shipments from './shipments'
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '../utilities/firebase/firebase';
import useFcmToken from '@/utilities/hooks/useFcmToken';
import { toast } from 'react-toastify';

const Login = dynamic(() => import('./login'), {
	ssr: false,
});

const Shipments = dynamic(() => import('./shipments'), {
	ssr: false,
});



export default function Home() {
	const { data: session, status } = useSession()
	const { fcmToken,notificationPermissionStatus } = useFcmToken();


	console.log({fcmToken, notificationPermissionStatus})


	



	return (
		<>
			<Head>
				<title>Qbuypanda</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>

				{session ? <Shipments /> : <Login />}

			</main>
		</>
	)
}
