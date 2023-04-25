import { Box, Dialog, Typography } from '@mui/material'
import React, { useState } from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import Custombutton from '@/components/Custombutton';
import { deleteData } from '@/CustomAxios';
import { toast } from 'react-toastify';


interface SimpleDialogProps {
    open: boolean;
    onClose: any;
    url: string;
    setData: any,
    data: any,
    _id: string

}

const CustomDelete = ({ open, onClose, url, setData, data, _id }: SimpleDialogProps) => {
    const [loading, setLoading] = useState<boolean>(false)

    const handleDelete = async () => {
        try {
            setLoading(true)
            await deleteData(url)
            let filter = data?.filter((res: any) => res?._id !== _id)
            setData(filter)
            toast.success('Deleted Successfully')
            setLoading(false)
            onClose()
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }


    }

    return (
        <Dialog
            maxWidth={'xs'}
            onClose={onClose} open={open}>
            <DialogTitle id="alert-dialog-title">
                <Box display={'flex'} justifyContent={'flex-end'}>
                    <HighlightOffRoundedIcon sx={{ cursor: 'pointer' }} onClick={onClose} />
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display={'flex'} justifyContent={'center'} mb={1}>
                    <Box width={35} height={35} display={'flex'} borderRadius={5} bgcolor={'#FF0000'} justifyContent={'center'} alignItems={'center'}>
                        <PriorityHighRoundedIcon sx={{ color: '#fff' }} />
                    </Box>
                </Box>
                <DialogContentText id="alert-dialog-description">
                    <Box py={1} display={'flex'} justifyContent={'center'}>
                        <Typography variant="body1" color="#000" fontFamily={`'Poppins' sans-serif`} fontSize={24} fontWeight={'bold'}>Delete Order</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'}>
                        <Typography width={'70%'} textAlign={'center'} fontFamily={`'Poppins' sans-serif`} fontSize={18} fontWeight={'bold'}>Are you sure you want to delete this order?</Typography>

                    </Box>
                </DialogContentText>
                <Box display={'flex'} justifyContent={'center'} py={1} >
                    <Custombutton
                        disabled={loading}
                        btncolor=''
                        height={'100%'}
                        IconEnd={""}
                        IconStart={''}
                        startIcon={false}
                        endIcon={false}
                        onClick={handleDelete}
                        label='Yes' />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CustomDelete
