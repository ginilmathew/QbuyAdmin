import { useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router'


type ProtectedRouteProps = {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter()

    const [token, setToken] = useState(true)

    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [])

    return <>{children}</>
}
