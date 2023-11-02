import { fetchData } from '@/CustomAxios'
import RiderDetailsform from '@/Widgets/RiderDetails/RiderDetailsForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const RiderEdit = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)




    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Rider' />
            <RiderDetailsform res={id}/>
        </Box>
    )
}

export default RiderEdit
