import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const PageNotFound = () => {
    return (
        <Box height={'100vh'} display={'flex'} justifyContent={'center'}>
            <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
                <Typography sx={{ fontFamily: `'Poppins' sans-serif`,}} fontSize={30}>Page Not Found !</Typography>
                <Typography>check to see if you are in the correct page</Typography>
                <Link href={'/'}>Click here to go  home</Link>
            </Box>

        </Box>
    )
}

export default PageNotFound