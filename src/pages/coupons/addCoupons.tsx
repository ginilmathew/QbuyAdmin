import CouponForm from '@/Widgets/Coupons/CouponForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

type props = {
  res?: any
  view?: any
}

function AddCoupons({ res, view }: props) {

  console.log({res,view})
  return (
    <Box px={5} py={2} pt={10} mt={0} >
      <CustomHeaderBack backlabel={view ? 'View Coupon' : res ? 'Edit Coupon' : 'Add Coupon'} />
      <CouponForm view={view} res={res}/>
    </Box>
  )
}

export default AddCoupons