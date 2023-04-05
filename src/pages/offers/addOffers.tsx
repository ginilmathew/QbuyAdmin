import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import OfferForm from '@/Widgets/Offers/OfferForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
function AddOffers() {
    return (
        <Box px={5} py={2} pt={10} mt={0} >
            <CustomHeaderBack backlabel='Add Offers' />
            <OfferForm/>

        </Box>
    )
}

export default AddOffers