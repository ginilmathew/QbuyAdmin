import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import CustomTextarea from '@/components/CustomTextarea';
import Custombutton from '@/components/Custombutton';
import { postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
type props = {
    handleClose: any;
    open: boolean;
    res: any;
    functioncall:any



}

type Inputs = {
    refund_amount: any;
    transaction_id: any;
    refund_note: any
};



const RefundModal = ({ handleClose, open, res,functioncall }: props) => {

    const schema = yup.object().shape({
        transaction_id:yup.string().required('Transactions ID is Required')
    });

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
                transaction_id: '',
                refund_note: ''
            },
        }
        );

    useEffect(() => {
        if (res) {
            setValue('refund_amount', res?.refundAmount)
        }
    }, [res])



    const SubmitHandle = async (data: any) => {

        let values = {
            order_id: res?._id,
            refund_details: { refund_amount: data?.refund_amount, transaction_id: data?.transaction_id, refund_note: data?.refund_note }
        }

  
        try {
            await postData('admin/order-refund', values)
            toast.success("Refund Successfuly");
            functioncall();
            handleClose()
    
        } catch (err:any) {
            let message = 'Unknown Error';
            if (err instanceof Error) message = err.message;
            reportError({ message });
            toast.error(message);
        }
    }


    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={'xs'}
            fullWidth
        >
            <Box p={1} >
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box>

                    </Box>
                    <Box>
                        <Typography sx={{
                            fontSize: {
                                lg: 24,
                                md: 20,
                                sm: 16,
                                xs: 11,
                            },
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            fontFamily: `'Poppins' sans-serif`,
                        }}>{'Refund'}</Typography>
                    </Box>
                    <Box onClick={handleClose}>
                        <Box
                            width={25}
                            height={25}
                            sx={{
                                backgroundColor: 'black',
                                borderRadius: 5,
                                p: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}>
                            <HighlightOffIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                    </Box>
                </Box>
                <DialogContent>
                    <Grid container spacing={2} display={'flex'} flexDirection={'row'} justifyItems={'center'}>
                        <Grid item xs={12} lg={12}>
                            <CustomInput

                                type='text'
                                control={control}
                                error={errors.refund_amount}
                                fieldName="refund_amount"
                                placeholder={``}
                                fieldLabel={"Refund Amount"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <CustomInput

                                type='text'
                                control={control}
                                error={errors.transaction_id}
                                fieldName="transaction_id"
                                placeholder={``}
                                fieldLabel={"Transaction ID"}
                                disabled={false}
                                view={false}

                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <CustomTextarea
                                // type='text'
                                control={control}
                                error={errors.refund_note}
                                fieldName="refund_note"
                                placeholder={``}
                                fieldLabel={"Refund Note"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>

                    </Grid>
                    <Box py={2} display={'flex'} justifyContent={'center'}>
                        <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Submit'}
                            disabled={false}
                            onClick={handleSubmit(SubmitHandle)} />
                    </Box>

                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default RefundModal