import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import PandaCoinsForm from '@/Widgets/PandaCoins/PandaCoinsForm'
import { Box } from '@mui/material'
import React from 'react'

const index = () => {
  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <CustomHeaderBack backlabel='Edit Panda Coin' />
     <PandaCoinsForm view={true}/>
</Box>
  )
}

export default index