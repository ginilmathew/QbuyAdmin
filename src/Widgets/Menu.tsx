import { Box, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Admin_item } from "../utilities/Menu_items"
import AdminLists from './AdminLists';

type props = {
    Icon: any,
    text: string,
    ArrowIcon: any,
    onClick: any,
    id: string,
    anchorEl: null | HTMLElement,
    open: any,
    handleClose: any,
    unique: string
}


const Menus = ({ Icon, text, ArrowIcon, onClick, id, anchorEl, open, handleClose, unique }: props) => {


    return (
        <>
            <Stack
                id={id}
                aria-controls={open ? id + id : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                alignItems={'center'} gap={1} direction={'row'} onClick={onClick} sx={{ display: { md: 'flex', sm: 'none', xs: 'none' } }}>
                <Icon sx={{ cursor: 'pointer' }} />
                <Typography sx={{ cursor: 'pointer', fontFamily: `'Poppins' sans-serif`, }} letterSpacing={1} fontSize={14} fontWeight={'bold'}>{text}</Typography>
                <ArrowIcon sx={{ cursor: 'pointer' }} />
            </Stack>
            <Menu
                id={id + id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': id,
                }}
            >
                <AdminLists id={unique} handleClose={handleClose} />
            </Menu>
        </>

    )
}

export default Menus