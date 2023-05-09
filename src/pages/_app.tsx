import '@/styles/globals.css'
import Header from '@/Widgets/Header';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import UserProvider from '@/helpers/user/UserContext';
import ProtectedRoute from '@/Routes/protectedRoutes';
import React, { useEffect } from 'react';
import Router from 'next/router';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderProvider from '@/helpers/header/HeaderContext';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '600', '700']
})



export default function App({ Component, pageProps }: AppProps) {
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

    <UserProvider>
      <ProtectedRoute>
        <LoadScript
          id="script-loader"
          googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLEKEY}`}
          language="en"
          region="us"
          libraries={["drawing"]}
        >
          {showHeader && <Header />}
          <Component {...pageProps} />
          <ToastContainer />
        </LoadScript>
      </ProtectedRoute>
    </UserProvider>

    {/* </LoadScript> */}
  </main>


}
