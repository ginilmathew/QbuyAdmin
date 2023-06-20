import { useEffect, useState, useContext, useLayoutEffect, useCallback } from 'react'
import { useRouter } from 'next/router';

import { LinearProgress, Stack } from '@mui/material';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import UserContext from '@/helpers/user';
import { useSession } from "next-auth/react"


type ProtectedRouteProps = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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
            }

        } catch (err) {
            router.push('/login')
        }
    }, [session])



    const getProfile = async (id: any) => {
        try {
            setLoading(false)
            setUserLoader(true)
            const response = await fetchData(`auth/profile/${id}`)
            userContext.setUser(response?.data?.data)
        } catch (err: any) {
            setUserLoader(false)
            toast.error(err?.message)
        } finally {
            setUserLoader(false)
        }
    }

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
