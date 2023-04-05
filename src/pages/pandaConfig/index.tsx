import React from 'react'
import { useRouter } from 'next/router';
import { Box, Stack ,Typography} from '@mui/material';


const PandaConfig = () => {

   
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Typography py={2} sx={{color:'#58D36E', fontFamily: `'Poppins' sans-serif`,fontSize:30,fontWeight:'bold'}}>Panda Config</Typography>
            
        </Box>
    )
}

export default PandaConfig
