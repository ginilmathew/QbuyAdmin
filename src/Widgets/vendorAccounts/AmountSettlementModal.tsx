import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomInput from '@/components/CustomInput';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';
import CustomMultiselect from '@/components/CustomMultiselect';
import Customselect from '@/components/Customselect';
import Custombutton from '@/components/Custombutton';
import moment from 'moment';
import { postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';


type Inputs = {
    amount: string,
    payment_mode: string,
    transaction_id: string,
    transaction_date_time: any
}


export interface SimpleDialogProps {
    open: boolean;
    onClose: any;
    data: any,
    price: any,
    id: string,
    setVendorSinglelist: any,
    viewVendor: any

}


const AmountSettlementModal = (props: SimpleDialogProps) => {
    const { onClose, data, open, price, id, setVendorSinglelist, viewVendor } = props;

    const router = useRouter()


    const [payment, setPayment] = useState<any>([{ value: 'UPI', name: 'UPI' }, { value: 'cash', name: 'Cash' }]);
    const [paymentSelect, setPaymentSelect] = useState<any>(null);
    const [time, setTime] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false)


    const schema = yup
        .object()
        .shape({
            transaction_id: yup.string().required('Required'),
            payment_mode: yup.string().required('Required')
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
                transaction_id: '',
                payment_mode: ''


            }
        });


    useEffect(() => {
        if (open) {
            setValue('amount', price)
        }
    }, [open])





    const ChangepaymentMode = (e: any) => {
        const { value } = e.target;
        setPaymentSelect(value)
        setValue('payment_mode', value)
        setError('payment_mode', { message: '' })
    }


    const OnChangeDate = (value: any) => {
        console.log({ value })
        setTime(value)
    }





    const submitData = useCallback(async (item: any) => {
        let orderId = data?.reduce((acc: any, obj: any) => acc.concat(obj.order_id_array), []);

        let value = {
            order_ids: orderId,
            vendor_id: id,
            transaction_date: moment(time).format('YYYY-MM-DD HH:mm A'),
            amount: price?.toString(),
            payment_mode: paymentSelect,
            transaction_id: item?.transaction_id,

        }

        try {
            setLoading(true)
            await postData('admin/account/vendors-settlement/create', value)
            setLoading(false)
            setVendorSinglelist(null)
            viewVendor()
            closeModal()
            // router.reload()
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        }

    }, [data, paymentSelect, time])

    const closeModal = () => {
        reset()
        setPaymentSelect(null)
        setTime(null)
        onClose()
    }

    return (
        <Box>
            <Dialog onClose={closeModal} open={open}>
                <Box p={2} >
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
                            }}>Amount Settlement</Typography>
                        </Box>
                        <Box onClick={closeModal}>
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
                                <CloseIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                        </Box>
                    </Box>

                    <DialogContent>
                        <Grid container spacing={2} >
                            <Grid item xs={12} lg={6}>
                                <CustomDateTimePicker
                                    values={time}
                                    changeValue={(value: any) => OnChangeDate(value)}
                                    fieldName='transaction_date_time'
                                    control={control}
                                    error={errors.transaction_date_time}
                                    fieldLabel={'Transaction Date & Time'}
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
                                <Customselect
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.payment_mode}
                                    fieldName="payment_mode"
                                    placeholder={``}
                                    fieldLabel={"PaymentMode"}
                                    selectvalue={""}
                                    height={40}
                                    label={''}
                                    size={16}
                                    value={paymentSelect}
                                    options={''}
                                    onChangeValue={ChangepaymentMode}
                                    background={'#fff'}
                                >
                                    <MenuItem value="" disabled >
                                        <em>change PaymentMode</em>
                                    </MenuItem>
                                    {payment.map((res: any) => (
                                        <MenuItem value={res?.value}>{res?.name}</MenuItem>
                                    ))}
                                </Customselect>
                            </Grid>
                            <Grid item xs={12} lg={6}>
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

                        </Grid>
                        <Box display={'flex'} justifyContent={'center'} py={3}>
                            <Custombutton
                                disabled={loading}
                                label='ADD'
                                btncolor='#58d36e'
                                onClick={handleSubmit(submitData)}
                                endIcon={false}
                                startIcon={false}
                                IconStart={undefined}

                                IconEnd={undefined} height={undefined} />
                        </Box>
                    </DialogContent>
                </Box>

            </Dialog>

        </Box>
    )
}

export default AmountSettlementModal