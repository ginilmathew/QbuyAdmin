import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import ShippingOrderForm from '@/Widgets/Shippings/ShippingOrderForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const OrderEdit = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Order' />
            <ShippingOrderForm res={id} />
        </Box>
    )
}

export default OrderEdit