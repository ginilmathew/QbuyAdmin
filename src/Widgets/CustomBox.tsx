import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'

type Props = {
    title: string,
    children?: string | JSX.Element | JSX.Element[] ,
};

const CustomBox = ({ title, children }: Props) => {
    return (
        <Box py={1}>
            <Typography px={1} py={1} fontSize={22} letterSpacing={1} fontWeight={'bold'}>{title}</Typography>
             <Box borderRadius={5} bgcolor={'#fff'} px={2} py={3} boxShadow={1}>
                {children}
            </Box>
        </Box>
    )
}

export default CustomBox