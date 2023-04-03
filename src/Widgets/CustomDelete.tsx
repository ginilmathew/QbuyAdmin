import { Box, Dialog } from '@mui/material'
import React from 'react'


interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}


const CustomDelete = ({ open, onClose }: SimpleDialogProps) => {




    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    const handleClose = () => {

    }

    return (
        <Dialog onClose={handleClose} open={open}>
            

        </Dialog>
    )
}

export default CustomDelete
