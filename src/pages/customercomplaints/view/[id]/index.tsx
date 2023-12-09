import { fetchData } from '@/CustomAxios'
import CustomerComplaintForm from '@/Widgets/CustomerComplaint/CustomerComplaintForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
const index = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Customer Complaint' />
            <CustomerComplaintForm view={id} />
        </Box>
    )
}

export default index