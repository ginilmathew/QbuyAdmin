import React, { memo } from 'react'
import { Box } from '@mui/material'
import ProductForm from '@/Widgets/Product/productForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import ProductPandaForm from '@/Widgets/Product/productPandaForm'
const AddProduct = () => {

	let type = process.env.NEXT_PUBLIC_TYPE;

	console.log({ type })
	return (
		<Box px={5} py={2} pt={10} mt={0}>
			<CustomHeaderBack backlabel='Add Product' />
			<ProductForm />
		</Box>
	)
}

export default AddProduct