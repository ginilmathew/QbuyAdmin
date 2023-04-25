import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import ProductForm from '@/Widgets/Product/productForm'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
const ProductView = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false);
    const [productList, setProductList] = useState<any>(null);

    const getProduct = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/product/show/${id}`)
            setProductList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }, [productList]);

    useEffect(() => {
        getProduct()
    }, [])




    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Product' />
            <ProductForm view={productList} />
        </Box>
    )
}

export default ProductView