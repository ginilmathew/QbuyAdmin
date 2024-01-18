import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'

const index = () => {

    const router = useRouter();
    const { hello } = router.query;
    console.log({hello})
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Product Viewed Report' />

        </Box>
    )
}

export default index