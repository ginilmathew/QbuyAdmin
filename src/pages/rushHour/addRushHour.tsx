import React from 'react';
import { Box } from '@mui/material'
import ProductForm from '@/Widgets/Product/productForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RushHourForm from '@/Widgets/RushHour/RushHourForm';

const AddRushHour = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Rush Hour' />
            <RushHourForm/>
           
        </Box>
    )
}

export default AddRushHour
