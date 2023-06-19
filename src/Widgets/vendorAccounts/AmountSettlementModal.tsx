import { Box, DialogContent, Grid, Typography } from '@mui/material'
import React from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomInput from '@/components/CustomInput';


type Inputs = {
    amount: string
}


export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}


const AmountSettlementModal = (props: SimpleDialogProps) => {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    const schema = yup
        .object()
        .shape({


        })
        .required();



    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {



            }
        });

    return (
        <Box>
            <Dialog onClose={handleClose} open={open}>
                <Box p={2} >
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>

                        </Box>
                        <Box>
                            <Typography>Amount Settlement</Typography>
                        </Box>
                        <Box>
                            <Box
                                width={25} height={25} sx={{ backgroundColor: 'black', borderRadius: 5, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                <CloseIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                        </Box>
                    </Box>

                    <DialogContent>
                        <Grid container spacing={2} >
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.amount}
                                    fieldName="amount"
                                    placeholder={``}
                                    fieldLabel={"Amount"}
                                    disabled={false}
                                    view={true}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.amount}
                                    fieldName="amount"
                                    placeholder={``}
                                    fieldLabel={"Amount"}
                                    disabled={false}
                                    view={true}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.amount}
                                    fieldName="amount"
                                    placeholder={``}
                                    fieldLabel={"Amount"}
                                    disabled={false}
                                    view={true}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.amount}
                                    fieldName="amount"
                                    placeholder={``}
                                    fieldLabel={"Amount"}
                                    disabled={false}
                                    view={true}
                                    defaultValue={''}
                                />
                            </Grid>

                        </Grid>
                    </DialogContent>
                </Box>

            </Dialog>

        </Box>
    )
}

export default AmountSettlementModal