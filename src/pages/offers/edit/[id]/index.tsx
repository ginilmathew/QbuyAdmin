import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import CustomerGroupForm from '@/Widgets/CustomerGroupForm.tsx/CustomerGroupForm'
import OfferForm from '@/Widgets/Offers/OfferForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Offer' />
            <OfferForm res={true}/>
        </Box>
    )
}

export default index