import React, { useEffect, useState, useContext, useLayoutEffect, useCallback } from 'react'
import { useRouter } from 'next/router';

import { LinearProgress, Stack } from '@mui/material';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import UserContext from '@/helpers/user';
import { useSession } from "next-auth/react"
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/utilities/firebase/firebase';
import useFcmToken from '@/utilities/hooks/useFcmToken';

type ProtectedRouteProps = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { fcmToken, notificationPermissionStatus } = useFcmToken();


    const [loading, setLoading] = useState(true)
    const [userLoader, setUserLoader] = useState<boolean>(false)
    const router = useRouter()
    const userContext = useContext(UserContext);

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })




    useEffect(() => {



        try {
            if (session) {
                let details = JSON.parse(JSON.stringify(session.user))

                localStorage.setItem("token", details?.accessToken)
                getProfile(details?._id)
                if (fcmToken) {
                    FunctionToken(details)
                }




            }

        } catch (err) {
            router.push('/login')
        }



    }, [session])

    const FunctionToken = async (details: any) => {
        try {
            let val = {
                id: details?._id,
                token: fcmToken
            }
            await postData('/auth/update-webtoken', val)

        } catch (err) {

        }

    }



    const getProfile = async (id: any) => {
        try {
            setLoading(false)
            setUserLoader(true)
            const response = await fetchData(`auth/profile/${id}`)
            localStorage.setItem("user", response?.data?.data)
            userContext.setUser(response?.data?.data)
            console.log({})
        } catch (err: any) {
            setUserLoader(false)
            toast.error(err?.message)
        } finally {
            setUserLoader(false)
        }
    }

    const LinkFunction = (payload: any) => {
        if (payload?.data?.link) {
            router.push(payload?.data?.link)
        }


    }

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground push notification received:', payload);
                const notificationOptions = {
                    body: payload?.notification?.body,
                    icon: 'images/panda.png',
                    sound: 'default'

                };
                //new Notification(payload?.notification?.title, notificationOptions);
                toast(({ closeToast }) => <div style={{ display: 'flex', flexDirection: 'column' }} onClick={() => LinkFunction(payload)}>
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

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const user: any = JSON.parse(localStorage.getItem('user') ?? '{}');
    //     if (!token && loading) {
    //         router.push('/login')
    //     } else {
    //         getProfile(user?._id)
    //         setLoading(false)
    //     }
    // }, [])

    if (status === "loading") {
        return (
            <div>Loading...</div>
        )
    }



    return <>
        {children}
    </>
}
