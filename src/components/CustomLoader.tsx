import React from 'react'
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';


const CustomLoader = () => {
    return (
        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyContent={'center'} alignItems={'center'} height={'80vh'}>

            <CircularProgress color="success" />

        </Stack>
    )
}

export default CustomLoader