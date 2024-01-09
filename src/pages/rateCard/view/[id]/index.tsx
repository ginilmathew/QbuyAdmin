import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RateCardForm from '@/Widgets/RateCard/RateCardForm'
import { Box } from '@mui/material'
import React from 'react'

const RateCardView = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Rate' />
            <RateCardForm view={true} />

        </Box>
    )
}

export default RateCardView