import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import LatestOrderForm from '@/Widgets/LatestOrderForm/LatestOrderForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Latest Order Review' />
           <LatestOrderForm/>
        </Box>
    )
}

export default index