import CustomDeliveryCharge from '@/Widgets/CustomDeliveryCharge/customDeliveryCharge'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import React from 'react'

const addDeliveryCharges = () => {
  return (
    <Box px={5} py={2} pt={10} mt={0} >
      <CustomHeaderBack backlabel='Add Delivery Charge' />
      <CustomDeliveryCharge />

    </Box>
  )
}

export default addDeliveryCharges