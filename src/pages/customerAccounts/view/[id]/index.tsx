import { fetchData } from '@/CustomAxios'
import CustomerAccountForm from '../../customerview'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

const index = () => {
    const router = useRouter()
    const { id } = router.query
 
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Customer' />
            <CustomerAccountForm view={id} />
        </Box>
    )
}

export default index