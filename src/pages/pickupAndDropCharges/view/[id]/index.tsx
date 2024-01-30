import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import PickUpAndDropCharges from '@/Widgets/PickUpAndDropCharges/PickUpAndDropCharges'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View PickUp And Drop' />
            <PickUpAndDropCharges view={true}/>

        </Box>)
}

export default index