import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RiderTicketForm from '@/Widgets/RiderTickets/RiderTicketForm'
import { Box } from '@mui/material'
import React from 'react'

const RiderTicketEdit = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Tickets' />
            <RiderTicketForm res={true} />
        </Box>
    )
}

export default RiderTicketEdit