import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import RushHourForm from '@/Widgets/RushHour/RushHourForm'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const RushHourView = () => {

  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <CustomHeaderBack backlabel='View Rush Hour' />
      <RushHourForm view={true} />

    </Box>
  )
}

export default RushHourView