import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import Vendorform from '@/Widgets/vendor/vendorform'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const addVendor = () => {
    const router = useRouter()

  return (
    <Box px={5} py={2} pt={10} mt={0} >

        <CustomHeaderBack backlabel='Add Vendor'/>
        <Vendorform/>
    </Box>
  )
}

export default addVendor