import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import ProductForm from '@/Widgets/Product/productForm'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
const ProductEdit = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false);
    const [productList, setProductList] = useState<any>(null);



    const getProduct = async () => {
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
    }

  


    useEffect(() => {
        getProduct()
    }, [])

    
    if(loading){
        return <Box>
            <Typography>Loading....</Typography>
        </Box>
    }
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Product' />
             <ProductForm res={productList}/>
        </Box>
    )
}

export default ProductEdit
