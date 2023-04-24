import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const PageNotFound = () => {
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
                <Typography>Page Not Found !</Typography>
                <Typography>check to see if you are in the correct page</Typography>
                <Link href={'/'}>Click here to go  home</Link>
            </Box>

        </Box>
    )
}

export default PageNotFound