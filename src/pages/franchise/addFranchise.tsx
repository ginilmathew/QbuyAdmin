import FranchiseForm from '@/Widgets/Franchise/FranchiseForm'
import React from 'react'
import { Box } from '@mui/material'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
const addFranchise = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Franchise' />
            <FranchiseForm />
        </Box>
    )
}

export default addFranchise
