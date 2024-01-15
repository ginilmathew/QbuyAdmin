import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import MerchantMarketingForm from '@/Widgets/MerchantMarketing/MerchantMarketingForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Merchant Marketing' />
            <MerchantMarketingForm view={true} />
        </Box>
    )
}

export default index