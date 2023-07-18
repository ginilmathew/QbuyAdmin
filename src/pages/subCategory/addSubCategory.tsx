import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import SubCategoryForm from '@/Widgets/subCategory/subCategoryForm'
import { Box } from '@mui/material'
import React from 'react'

const addSubCategory = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0} >
            <CustomHeaderBack backlabel='Add SubCategory' />
             <SubCategoryForm/>
        </Box>
    )
}

export default addSubCategory
