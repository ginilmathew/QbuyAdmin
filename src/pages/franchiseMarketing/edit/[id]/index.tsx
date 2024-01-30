import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import FranchiseMarketingForm from '@/Widgets/FranchiseMarketing/FranchiseMarketingForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Franchise Marketing' />
            <FranchiseMarketingForm res={true} />
        </Box>
    )
}

export default index