import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import CustomerDetailsForm from '@/Widgets/CustomerDetails/CustomerDetailsForm'
import { Box } from '@mui/material'
import React from 'react'

const addCustomer = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Customer' />
            <CustomerDetailsForm />
        </Box>
    )
}

export default addCustomer