import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import AddExtraChargevalue from '@/Widgets/ExtraChargeValue/AddExtraChargevalue'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Extra Charge' />
           <AddExtraChargevalue res={true}/>

        </Box>
    )
}

export default index