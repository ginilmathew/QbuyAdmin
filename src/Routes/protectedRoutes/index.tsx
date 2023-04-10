import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router';
import UserContext from '@/helpers/user';


type ProtectedRouteProps = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter()
    const userContext = useContext(UserContext);

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (!token && !userContext.user) {
            router.push('/login')
        }
    }, [])

    return <>{children}</>
}
