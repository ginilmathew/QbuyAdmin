import CustomDeliveryCharge from '@/Widgets/CustomDeliveryCharge/customDeliveryCharge'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Delivery Charge' />
            <CustomDeliveryCharge res={true}/>
        </Box>
    )
}

export default index