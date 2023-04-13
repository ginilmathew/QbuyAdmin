import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

type props = {
    heading: string,
    loginhrs: string,
    utilization: string,
    prmryFranchise: string,
    secndryFranchise: string,
    freeRiders: string,
    OfflineRiders: string

}

const CustomSmartSuggestionBox = ({ heading, loginhrs, utilization, prmryFranchise, secndryFranchise, freeRiders, OfflineRiders }: props) => {
    let texttruncate = heading.slice(0, 3);
    let custtext = heading.slice(3)

    return (
        <Box p={2} boxShadow={1} sx={{ background: '#fff', borderRadius: 1 }}>
            <Typography fontSize={16} py={1} fontWeight={'bold'}> <span style={{ borderBottom: '3px solid #58d36e', paddingBottom: 2, fontFamily: `'Poppins' sans-serif`, fontWeight: 'bold' }}>{texttruncate}</span>{custtext} </Typography>
            <Box display={'flex'} justifyContent={'space-between'} py={1} sx={{ borderBottom: '2px dotted #f5f5f5' }}>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`}>{'Total Login Hrs'}</Typography>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`} fontWeight={'bold'} color={'#58d36e'}>{loginhrs}</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} py={1} sx={{ borderBottom: '2px dotted #f5f5f5' }}>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`}>{'Utilization'}</Typography>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`} color={'#58d36e'} fontWeight={'bold'}>{utilization}</Typography>
            </Box>
            <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`} py={1} fontWeight={'bold'}>{'Live Riders'}</Typography>
            <Box display={'flex'} justifyContent={'space-between'} py={1} sx={{ borderBottom: '2px dotted #f5f5f5' }}>
                <Typography fontSize={12} fontFamily={`'Poppins' sans-serif`}>{'Primary Franchise'}</Typography>
                <Typography fontSize={12} fontFamily={`'Poppins' sans-serif`} color={'#58d36e'} fontWeight={'bold'}>{prmryFranchise}</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} py={1} sx={{ borderBottom: '2px dotted #f5f5f5' }}>
                <Typography fontSize={12} fontFamily={`'Poppins' sans-serif`}>{'Secondary Franchise'}</Typography>
                <Typography fontSize={12} fontFamily={`'Poppins' sans-serif`} color={'#58d36e'} fontWeight={'bold'}>{secndryFranchise}</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} py={1} sx={{ borderBottom: '2px dotted #f5f5f5' }}>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`}>{'Free Riders'}</Typography>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`} color={'#58d36e'} fontWeight={'bold'}>{freeRiders}</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} py={1} sx={{ borderBottom: '2px dotted #f5f5f5' }}>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`}>{'Offline Riders'}</Typography>
                <Typography fontSize={14} fontFamily={`'Poppins' sans-serif`} color={'#58d36e'} fontWeight={'bold'}>{OfflineRiders}</Typography>
            </Box>

        </Box>




    )
}

export default CustomSmartSuggestionBox
