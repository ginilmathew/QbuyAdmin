import React from 'react'
import { Box } from '@mui/material'
import ProductForm from '@/Widgets/Product/productForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import MesssageBannerForm from '@/Widgets/MessageBanner/MesssageBannerForm'


const AddBanner = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Message Banner' />
            <MesssageBannerForm />
        </Box>
    )
}

export default AddBanner
