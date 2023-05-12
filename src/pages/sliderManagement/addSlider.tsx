import React from 'react'
import { Box } from '@mui/material'
import SliderManagementForm from '@/Widgets/SliderManagement/sliderManagementForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
const AddSlider = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Slider' />
            <SliderManagementForm />
        </Box>
    )
}

export default AddSlider