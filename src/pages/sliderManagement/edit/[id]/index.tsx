import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import SliderManagementForm from '@/Widgets/SliderManagement/sliderManagementForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const index = () => {
    const router = useRouter()
    const { id } = router.query
  return (
    <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Slider' />
            <SliderManagementForm res={id}/>
        </Box>
  )
}

export default index