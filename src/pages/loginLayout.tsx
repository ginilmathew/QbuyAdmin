import React from 'react'
import { Avatar, Box, Stack, styled, Typography } from '@mui/material';
import Login from './login';
const LoginLayout = () => {
    const BOX = styled(Box)({
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${`/images/login.png`})`,
        alignItems: 'center',
        justifyContent: 'center',
        objectFit: 'contain',
        display: 'flex',
        flexDirection: 'column'
    })

  return (
    <BOX>
        <Login/>
    </BOX>
  )
}

export default LoginLayout