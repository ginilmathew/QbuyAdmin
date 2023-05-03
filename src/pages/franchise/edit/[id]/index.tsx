import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchData } from '@/CustomAxios'
import { toast } from 'react-toastify'
import { Box, Typography } from '@mui/material'
import FranchiseForm from '@/Widgets/Franchise/FranchiseForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'

type props = {
    id: string
}

const FranchiseEdit = () => {
    const router = useRouter()
    const { id } = router.query

    
    return (
        <Box px={5} py={2} pt={10} mt={0}>
             <CustomHeaderBack backlabel='Edit Franchise' />
             <FranchiseForm res={id} />
        </Box>
    )
}

export default FranchiseEdit
