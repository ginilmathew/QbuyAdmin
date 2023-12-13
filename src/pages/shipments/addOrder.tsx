import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import NewOrderForm from '@/Widgets/Shippings/NewOrderForm'
import ShippingOrderForm from '@/Widgets/Shippings/ShippingOrderForm'
import { Box } from '@mui/material'
import React from 'react'

const AddOrder = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0} >
             <CustomHeaderBack backlabel='Add Order'/>
             <NewOrderForm add={true} />
        </Box>
    )
}

export default AddOrder