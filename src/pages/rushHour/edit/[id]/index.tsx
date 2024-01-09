import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RushHourForm from '@/Widgets/RushHour/RushHourForm'
import { Box } from '@mui/material'
import React from 'react'

const RushHourEdit = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Rush Hour' />
            <RushHourForm res={true} />
        </Box>
    )
}

export default RushHourEdit