import React, { memo } from 'react'
import { Box } from '@mui/material'

import CustomHeaderBack from '@/Widgets/CustomHeaderBack'

import PickUp from './PickUp';


const addPickAndDrop = () => {



	return (
		<Box px={5} py={2} pt={10} mt={0}>
			<CustomHeaderBack backlabel='Add PickUp And Drop' />
			<PickUp />
		</Box>
	)
}

export default addPickAndDrop