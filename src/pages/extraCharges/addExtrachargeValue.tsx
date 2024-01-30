import { fetchData } from '@/CustomAxios'
import CustomBox from '@/Widgets/CustomBox'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import AddExtraChargevalue from '@/Widgets/ExtraChargeValue/AddExtraChargevalue'
import { Box } from '@mui/material'
import React, { useEffect, useReducer } from 'react'

const addExtrachargeValue = () => {




    return (
        <Box px={5} py={2} pt={10} mt={0} >
            <CustomHeaderBack backlabel='Create Extra Charge Value' />
            <AddExtraChargevalue/>
          

        </Box>
    )
}

export default addExtrachargeValue