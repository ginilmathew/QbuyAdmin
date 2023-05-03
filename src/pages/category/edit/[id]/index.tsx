import { fetchData } from '@/CustomAxios'
import CategoryForm from '@/Widgets/CategoryManagement/categoryForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CategoryEdit = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)




    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Category' />
            <CategoryForm resData={id}/>
        </Box>
    )
}

export default CategoryEdit
