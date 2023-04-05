import CouponForm from '@/Widgets/Coupons/CouponForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

function AddCoupons() {
  return (
    <Box px={5} py={2} pt={10} mt={0} >
      <CustomHeaderBack backlabel='Add Coupons' />
      <CouponForm/>
    </Box>
  )
}

export default AddCoupons