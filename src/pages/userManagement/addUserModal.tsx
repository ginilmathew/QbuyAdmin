import { Box, Dialog, Typography, Grid } from '@mui/material'
import React from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import Custombutton from '@/components/Custombutton';
import { FormInputs } from '@/utilities/types';
import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
interface SimpleDialogProps {
    open: boolean;
    onClose: any;
}

const AddUserModal = ({ open, onClose }: SimpleDialogProps) => {

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();
    return (
        <Dialog
            maxWidth={'xs'}
            onClose={onClose} open={open}>
            <DialogTitle id="alert-dialog-title">
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Box></Box>
                    <Typography fontWeight={'bold'} fontSize={22} sx={{
                        fontFamily: `'Poppins' sans-serif`,
                    }}>Add User</Typography>
                    <HighlightOffRoundedIcon sx={{ cursor: 'pointer' }} onClick={onClose} />
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Grid container spacing={2} py={2}>
                        <Grid item xs={12} xl={6}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.email}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Name"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />

                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.email}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Role"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />

                        </Grid>

                    </Grid>
                </DialogContentText>
                <Box display={'flex'} justifyContent={'center'} py={2} >
                    <Custombutton
                        btncolor=''
                        height={40}
                        IconEnd={""}
                        IconStart={''}
                        startIcon={false}
                        endIcon={false}
                        onClick={() => null}
                        label='Add' />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default AddUserModal
