import { fetchData } from '@/CustomAxios'
import RiderSupportform from '@/Widgets/RiderSupport/RiderSupportForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import CustomTab from '@/components/CustomTab'


const RiderSuppotEdit = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)




    return (
        <Box px={5} py={2} pt={10} mt={0}>
               <CustomHeaderBack backlabel={`#`} />
            <CustomTab />
        </Box>
    )
}

export default RiderSuppotEdit
