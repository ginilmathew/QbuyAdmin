import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
const index = () => {

    const router = useRouter()
    const { id } = router.query;
    const [loader, setLoader] = useState<boolean>(false)

    const getVenderListShow = async () => {

        try {
            setLoader(true)
            const response = await fetchData(`admin/order/show/${id}`)
            console.log({ response })

            setLoader(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)

        } finally {
            setLoader(false)
        }

    }


    useEffect(() => {
        getVenderListShow()
    }, [])
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Pick Up Order' />
            


        </Box>
    )
}

export default index