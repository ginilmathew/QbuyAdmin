import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import FranchiseMarketingForm from '@/Widgets/FranchiseMarketing/FranchiseMarketingForm'
import { Box } from '@mui/material'
import React from 'react'

const AddFranchiseMarketing = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Add Franchise Marketing' />
            <FranchiseMarketingForm/>
        </Box>
    )
}

export default AddFranchiseMarketing