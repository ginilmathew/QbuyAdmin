import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import VendorAccountsForm from '@/Widgets/vendorAccounts/vendorAccountsForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const VendorAccountsFormView = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Vendor' />
            <VendorAccountsForm idd={id}/>
   
        </Box>
    )
}

export default VendorAccountsFormView