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

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Vendor' />
            <Vendorform view={id} />
        </Box>
    )
}

export default VendorView


