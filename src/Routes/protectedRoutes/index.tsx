import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router';
import UserContext from '@/helpers/user';
import { LinearProgress, Stack } from '@mui/material';


type ProtectedRouteProps = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const userContext = useContext(UserContext);

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (!token) {
            router.push('/login')     
        }
    }, [])
    return <>{children}</>
}
