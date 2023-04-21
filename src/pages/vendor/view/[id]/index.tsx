import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import Vendorform from '@/Widgets/vendor/vendorform'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'


const VendorView = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)
    const [vendorList, setVendorList] = useState<any>([])



    const getVendorlist = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor/show/${id}`)
            setVendorList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getVendorlist()
    }, [])

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Vendor' />
            <Vendorform view={vendorList} />
        </Box>
    )
}

export default VendorView