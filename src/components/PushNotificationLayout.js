
import React, { useState, useEffect, useContext } from "react";

import { requestForToken, onMessageListener } from '../Config/firebase';
import { toast } from "react-toastify";
import UserContext from "@/helpers/user";
import { useSession } from "next-auth/react";

function PushNotificationLayout({ children }) {

    const { data: session, status } = useSession()
    const [firebase, setFirebase] = useState({ title: '', body: '' });
    const userContext = useContext(UserContext);



    const Msg = ({ closeToast, toastProps }) => (
        <div>
            {firebase?.title} {toastProps.position}
            <p>{firebase.body}</p>
            <button onClick={closeToast}>Close</button>
        </div>
    )

    async function requestPermission() {
      requestForToken(session?.user);

        onMessageListener()
            .then((payload) => {
                console.log({ payload },'PAYLOAD')
                setFirebase({ title: payload?.firebase?.title, body: payload?.notification?.body });
                toast(Msg, {
                    toastId: "customId"
                });
            })
            .catch((err) => console.log('failed: THEIR IS AN ERROR', err));
    }

    useEffect(() => {
        requestPermission()
    }, [])


    return (
        <>
            {children}
        </>
    );
}

export default PushNotificationLayout;