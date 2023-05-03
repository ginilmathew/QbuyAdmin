import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import ProductForm from '@/Widgets/Product/productForm'
import CustomLoader from '@/components/CustomLoader'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
const ProductEdit = () => {
    const router = useRouter()
    const { id } = router.query

    
    // if(loading){
    //     return <CustomLoader/>
    // }
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Product' />
             <ProductForm res={id}/>
        </Box>
    )
}

export default ProductEdit
