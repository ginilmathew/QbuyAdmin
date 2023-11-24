import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import PushNotificationForm from '@/Widgets/PushNotification/PushNotificationForm'
import { Box } from '@mui/material'
import React from 'react'

const addpush = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Push Notifications' />
            <PushNotificationForm />
        </Box>
    )
}

export default addpush