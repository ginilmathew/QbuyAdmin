import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import PandaCoinsForm from '@/Widgets/PandaCoins/PandaCoinsForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
const AddPandaCoins = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0} >
            <CustomHeaderBack backlabel='Add Panda Coins' />
            <PandaCoinsForm/>
        </Box>
    )
}

export default AddPandaCoins