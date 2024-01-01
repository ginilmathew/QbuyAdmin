import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import CustomerGroupForm from '@/Widgets/CustomerGroupForm.tsx/CustomerGroupForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Customer Group' />
            <CustomerGroupForm res={true}/>
        </Box>
    )
}

export default index