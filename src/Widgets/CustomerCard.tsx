import { Box, Paper, Typography, styled } from '@mui/material'
import React, { useState } from 'react'

type props = {
    heading: string,
    text: string,
    count: string,
    type: string,
    numbercount: boolean
}


const CustomerCard = ({ heading, text, count, type, numbercount }: props) => {
    let texttruncate = heading.slice(0, 3);
    let custtext = heading.slice(3)

    const [img, setImge] = useState<string | null>(
        type === "customer" ? "/images/customer.png" :
            type === "sales" ? "/images/sales.png" :
                type === "order" ? "/images/order.png" :
                    type === "tickets" ? "/images/tickets.png" : null)

    return (
        <Box sx={{
            px: 1, py: 1,
            backgroundImage: `url(${img})`,
            backgroundColor: '#fff',
            objectFit: 'cover',
            backgroundPositionX: "right",
            backgroundPositionY: 'bottom',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            borderRadius: 1,
            boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px'  
        }}
            display="flex"
            justifyContent="space-between"

            flexDirection="column"
        >
            <Box>
                <Typography fontSize={14}> <span style={{ borderBottom: '3px solid #58d36e', paddingBottom: 2 ,fontFamily:`'Poppins' sans-serif`,}}>{texttruncate}</span>{custtext} </Typography>
                <Typography fontSize={12} py={1}>{text} </Typography>

                {numbercount &&
                    <Box display={'flex'} alignItems={'center'} gap={1} py={1}>
                        <Box height={20} width={20} borderRadius={5} display={'flex'} alignItems={'center'} p={.5} justifyContent={'center'} sx={{ background: "red" }}>
                            <Typography color={"#fff"} fontSize={12} sx={{fontFamily:`'Poppins' sans-serif`,}}>24</Typography></Box>
                        <Typography fontSize={12} sx={{fontFamily:`'Poppins' sans-serif`,}}>Processing</Typography>
                    </Box>

                }
                {numbercount &&
                    <Box display={'flex'} alignItems={'center'} gap={1} py={1}>
                        <Box height={20} width={20} borderRadius={5} display={'flex'} alignItems={'center'} p={.5} justifyContent={'center'} sx={{ background: "red" }}>
                            <Typography color={"#fff"} fontSize={12} sx={{fontFamily:`'Poppins' sans-serif`,}}>24</Typography></Box>
                        <Typography fontSize={12} sx={{fontFamily:`'Poppins' sans-serif`,}}>Picked</Typography>
                    </Box>

                }
                {numbercount &&
                    <Box display={'flex'} alignItems={'center'} gap={1} py={1}>
                        <Box height={20} width={20} borderRadius={5} display={'flex'} alignItems={'center'} p={.5} justifyContent={'center'} sx={{ background: "red" }}>
                            <Typography color={"#fff"} fontSize={12} sx={{fontFamily:`'Poppins' sans-serif`,}}>24</Typography></Box>
                        <Typography fontSize={12} sx={{fontFamily:`'Poppins' sans-serif`,}}>Resolved</Typography>
                    </Box>
                }
            </Box>
            <Box display={'flex'} justifyContent={'center'} alignItems="center" >
                <Typography fontWeight={'bold'} sx={{fontFamily:`'Poppins' sans-serif`,}} fontSize={30}>{count}</Typography>
            </Box>
        </Box>
    )
}

export default CustomerCard