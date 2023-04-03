import '@/styles/globals.css'
import Header from '@/Widgets/Header';
import { Box } from '@mui/material';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import UserProvider from '@/helpers/user/UserContext';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '600', '700']
})



export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname === '/login' ? false : true;



  return <main className={poppins.className}>
    {/* <LoadScript googleMapsApiKey="AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I" libraries={["drawing"]}> */}
    <UserProvider>
      {showHeader && <Header />}
      <Component {...pageProps} />
    </UserProvider>
    {/* </LoadScript> */}
  </main>


}
