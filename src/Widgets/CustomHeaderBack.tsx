import { Box, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/router';

type props = {
    backlabel: string
}

const CustomHeaderBack = ({ backlabel }: props) => {
    const router = useRouter()

    const routergoBack = () => {
        router.back()
    }

    return (
        <>
            <Box display={'flex'} gap={2} alignItems={'center'} py={2}>
                <ArrowBackIosIcon style={{ color: '#58D36E', fontWeight: 'bold', fontSize: 35, cursor: 'pointer' }} onClick={routergoBack} />
                <Typography fontSize={30} color={'#58D36E'} fontWeight={'bold'} sx={{fontFamily:`'Poppins' sans-serif`,}} letterSpacing={1} >{backlabel}</Typography>
            </Box>
        </>
    )
}

export default CustomHeaderBack