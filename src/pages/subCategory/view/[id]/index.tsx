import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import SubCategoryForm from '@/Widgets/subCategory/subCategoryForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const index = () => {

    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)
    const [subCategoryList, setSubCategoryList] = useState<any>([])

    const getSubCategory = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/subcategory/show/${id}`)
            setSubCategoryList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getSubCategory()
    }, [])
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View SubCategory' />
            <SubCategoryForm view={subCategoryList} />

        </Box>
    )
}

export default index