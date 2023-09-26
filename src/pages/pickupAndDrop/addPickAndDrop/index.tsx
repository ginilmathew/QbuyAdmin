import React, { memo } from 'react'
import { Box } from '@mui/material'

import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import PickupAndDropModal from '../PickupAndDropModal';
import PickUp from './PickUp';
import CustomFormModal from '../../../components/CustomFormModal'

const addPickAndDrop = () => {

	let type = process.env.NEXT_PUBLIC_TYPE;
console.log("add page");

	console.log({ type })
	return (
		<Box px={5} py={2} pt={10} mt={0}>
			<CustomHeaderBack backlabel='Add PickUp And Drop' />
			<PickUp />
		</Box>
	)
}

export default addPickAndDrop