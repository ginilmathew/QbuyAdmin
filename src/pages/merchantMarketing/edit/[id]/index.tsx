import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import MerchantMarketingForm from '@/Widgets/MerchantMarketing/MerchantMarketingForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Merchant Marketing' />
            <MerchantMarketingForm res={true} />
        </Box>
    )
}

export default index