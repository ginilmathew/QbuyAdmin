import { fetchData } from '@/CustomAxios'
import CategoryForm from '@/Widgets/CategoryManagement/categoryForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
const index = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)
    const [CategoryList, setCategoryList] = useState<any>(null)


    const getCategory = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/category/show/${id}`)
            setCategoryList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getCategory()
    }, [])
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Category' />
            <CategoryForm view={CategoryList} />
        </Box>
    )
}

export default index