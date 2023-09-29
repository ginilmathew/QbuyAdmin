import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
export interface SimpleDialogProps {
    open: boolean;
 
    onClose: (value: string) => void;
    children: any,

    heading?: string
}


const CustomApproveModal = (props: SimpleDialogProps) => {
    const { onClose, open, heading,children } = props;
    return (
        <Dialog onClose={onClose} open={open}>
            {/* <Box>
                <DialogTitle>{heading}</DialogTitle>
            </Box> */}
             <Box>
                {children}
             </Box>
        </Dialog>
    )
}

export default CustomApproveModal