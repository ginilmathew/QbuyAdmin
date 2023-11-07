import { fetchData } from '@/CustomAxios'
import RiderSupportform from '@/Widgets/RiderSupport/RiderSupportForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import CustomTab from '@/components/CustomTab'

const RiderSupportEdit = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [riderId, setRiderId] = useState<string | null>(null);

    useEffect(() => {
        const storedRiderId = sessionStorage.getItem('rider_id');
        if (storedRiderId) {
            setRiderId(storedRiderId);
        }
    }, []);

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel={`#${riderId}`} />
            <CustomTab />
        </Box>
    );
};

export default RiderSupportEdit;
