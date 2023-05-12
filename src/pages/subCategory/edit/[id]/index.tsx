import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import SubCategoryForm from '@/Widgets/subCategory/subCategoryForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import { toast } from 'react-toastify'

const SubCategoryEdit = () => {
    const router = useRouter()
    const { id } = router.query
  



    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit SubCategory' />
            <SubCategoryForm res={id}/>

        </Box>
    )
}

export default SubCategoryEdit
