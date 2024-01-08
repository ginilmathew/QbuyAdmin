import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RiderTicketForm from '@/Widgets/RiderTickets/RiderTicketForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const RiderTicketView = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Tickets' />
            <RiderTicketForm view={true}/>
        </Box>
    )
}

export default RiderTicketView