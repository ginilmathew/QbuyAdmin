import React from 'react'
import { Box } from '@mui/material'
import ProductForm from '@/Widgets/Product/productForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RateCardForm from '@/Widgets/RateCard/RateCardForm'
const addRateCard = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Rate' />
            <RateCardForm />
        </Box>
    )
}

export default addRateCard
