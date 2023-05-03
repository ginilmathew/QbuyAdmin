import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchData } from '@/CustomAxios'
import { toast } from 'react-toastify'
import { Box, Typography } from '@mui/material'
import FranchiseForm from '@/Widgets/Franchise/FranchiseForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'

const FranchiseView = () => {
    const router = useRouter()
    const { id } = router.query


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Franchise' />
            <FranchiseForm view={id} />

        </Box>
    )
}

export default FranchiseView