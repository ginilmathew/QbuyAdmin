import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RestauranRefferalForm from '@/Widgets/RestaurentRefferal/RestauranRefferalForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Restaurant Refferal' />
              <RestauranRefferalForm/>

        </Box>
    )
}

export default index