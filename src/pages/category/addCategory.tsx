import CategoryForm from '@/Widgets/CategoryManagement/categoryForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import React from 'react'

const addCategory = () => {
  return (
    <Box  px={5} py={2} pt={10} mt={0} >
          <CustomHeaderBack backlabel='Add Category'/>
          <CategoryForm/>
    </Box>
  )
}

export default addCategory