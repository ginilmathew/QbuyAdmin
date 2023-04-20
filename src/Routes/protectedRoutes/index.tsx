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


   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null


    useEffect(() => {

        const token = localStorage.getItem('token')

        if (!token && loading) {
            router.push('/login')
        } else {
            setLoading(false)
        }
    }, [])

    // if(loading){
    //     return <div>Loading....</div>
    // }

    return <>

        {children}
    </>
}
