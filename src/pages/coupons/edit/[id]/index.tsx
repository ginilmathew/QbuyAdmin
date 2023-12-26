import { Box } from '@mui/material'
import React from 'react'
import AddCoupons from '../../addCoupons'

const index = () => {
    return (
        <Box px={5} py={2} pt={2} mt={0}>
            <AddCoupons res={true}  />
        </Box>
    )
}

export default index