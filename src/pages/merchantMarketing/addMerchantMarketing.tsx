import React, { memo } from 'react'
import { Box } from '@mui/material'
import ProductForm from '@/Widgets/Product/productForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import MerchantMarketingForm from '@/Widgets/MerchantMarketing/MerchantMarketingForm'

const AddMerchantMarketing = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Merchant Marketing' />
            <MerchantMarketingForm/>
        
        </Box>
    )
}

export default AddMerchantMarketing
