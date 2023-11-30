import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import ProductForm from '@/Widgets/Product/productForm'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import RiderLifecycleForm from '@/Widgets/RiderLifecycle/RiderLifecycleForm'


const PickUpAndDropView = () => {
    const router = useRouter()
    const { id } = router.query
 
console.log("vie pickup");

  

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Rider Lifecycle' />
            <RiderLifecycleForm view={id}/>

        </Box>
    )
}

export default PickUpAndDropView