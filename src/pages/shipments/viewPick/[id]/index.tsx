import { fetchData, postData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Avatar, Box, Grid, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomBox from '@/Widgets/CustomBox'
import CustomInput from '@/components/CustomInput'
import moment from 'moment'
import { IMAGE_URL } from '@/Config'
import Customselect from '@/components/Customselect'
import CustomTimepicker from '@/components/CustomTimepicker'
import CustomDatePicker from '@/components/CustomDatePicker'
import Custombutton from '@/components/Custombutton'


type Inputs = {
    name: any,
    email: any,
    mobile: any,
    assign_rider: any,
    item_name: any,
    description: any,
    weight: any,
    vehicle_type: any,
    pickup_date: any,
    pickup_time: any,
    pickup_location: any,
    drop_off_location: any,
    image: any,
    payment_type: any,
    payment_status: any,
    pickup_location_coordinates: any,
    drop_off_location_coordinates: any
    billing_address: any,
    shipping_address: any,
    delivery_date: any,
    grand_total: any,
    franchise: any,
    type: any,
    order_status: any

};
const index = () => {

    const [paymentMethodList, setPaymentMethodList] = useState<any>([
        {
            id: 1,
            name: "Online",
            value: "online"
        },
        {
            id: 2,
            name: "COD",
            value: "COD"
        },

    ])
    const [orderSelect, setOrderSelect] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)
    const [orderviewList, setOrderViewList] = useState<any>(null)
    const [loader, setLoader] = useState<boolean>(false)
    const [orderList, setOrderList] = useState<any>([])
    const [paymentMethodSelect, setPaymentMethodSelect] = useState<string>('')
    const [paymentStatusList, setPaymentStatusList] = useState<any>([])
    const [paymentStatusSelect, setPaymentStatusSelect] = useState<string>('')
    const [multipleImage, setMultipleImage] = useState<any>([])
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [defaultImage, setdefaultImage] = useState<any>([])
    const [kilometer, setKilometer] = useState<any>({
        pick_lat: null,
        pick_lng: null,
        drop_lat: null,
        drop_lng: null
    })


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


    const router = useRouter()
    const { id } = router.query;


    useEffect(() => {
        const getmapList = async () => {
            try {
                setLoading(true)

                const response = await fetchData('common/payment-status-list');
                const responses = await fetchData('common/order-status-list')
                setOrderList(responses?.data?.data)
                setPaymentStatusList(response?.data?.data)


            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }

        getmapList()
    }, [])



    const getVenderListShow = async () => {

        try {
            setLoader(true)
            const response = await fetchData(`admin/order/show/${id}`)
            let data = response?.data?.data
            console.log({ data })

            setOrderViewList(response?.data?.data)

            data.pickup_date = data.pickup_date ? moment(data.pickup_date, 'YYYY-MM-DD') : null
            data.pickup_time = data.pickup_time ? moment(data.pickup_time, 'hh:mm') : null
            setValue('name', data?.name)
            setValue('email', data?.email)
            setValue('mobile', data?.mobile)
            setValue('item_name', data?.item_name)
            setValue('description', data?.description)
            setValue('description', data?.description)
            setValue('weight', data?.weight)
            setValue('pickup_date', data?.pickup_date)
            setValue('pickup_time', data?.pickup_time)
            setValue('vehicle_type', data?.vehicle_type)
            setValue('grand_total', data?.grand_total)
            setValue('pickup_location', data?.pickup_location)
            setValue('drop_off_location', data?.drop_off_location)
            setValue('payment_status', data?.payment_status)
            setValue('payment_type', data?.payment_type)
            setValue('order_status', data?.status)
            setOrderSelect(data?.status)
            setPaymentMethodSelect(data?.payment_type)
            setPaymentStatusSelect(data?.payment_status)

            if (data?.image) {
                setImagePreview(data?.image)
            }

            setLoader(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)

        } finally {
            setLoader(false)
        }

    }

    const orderStatusChange = (e: any) => {
        const { value } = e.target;
        setValue('order_status', value)
        setOrderSelect(value);
        setError('order_status', { message: '' })

    }
    const paymentMethodChange = (e: any) => {
        const { value } = e.target;
        setValue("payment_type", value)
        setPaymentMethodSelect(value)
    }

    const paymentStatusChange = (e: any) => {
        const { value } = e.target;
        setValue("payment_status", value)
        setPaymentStatusSelect(value)
    }




    useEffect(() => {
        getVenderListShow()
    }, [])


    const SubmitOrder = async (data: any) => {
        let value = {
            payment_status: data?.payment_status,
            status: data?.order_status,
            id: id
        }

        try {
            await postData('/admin/pickup-drop/update', value)
            toast.success('Order Updated Successfully')
            router.back()

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)

        } finally {

        }



    }
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Pick Up Order' />
            <CustomBox title='Customer Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="email"
                            placeholder={``}
                            fieldLabel={"Email Address"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>

                </Grid>
            </CustomBox>
            <CustomBox title='Pickup And Drop Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.item_name}
                            fieldName="item_name"
                            placeholder={``}
                            fieldLabel={"PickUp Item Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <CustomInput
                            type='text'
                            control={control}

                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Description"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.weight}
                            fieldName="weight"
                            placeholder={``}
                            fieldLabel={"Weight"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>


                    <Grid item xs={12} lg={2}>
                        <CustomDatePicker
                            values={''}
                            disabled={true}
                            changeValue={(e) => null}
                            fieldName='pickup_date'
                            control={control}
                            error={errors.pickup_date}
                            fieldLabel={'Pickup Date'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomTimepicker
                            changeValue={(e) => null}
                            fieldName='pickup_time'
                            control={control}
                            disabled={true}
                            error={errors.pickup_time}
                            fieldLabel={'Pickup Time'} />


                    </Grid>
                    {id && <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.pickup_location}
                            fieldName="pickup_location"
                            placeholder={``}
                            fieldLabel={"Pickup Location"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>}

                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.drop_off_location}
                            fieldName="drop_off_location"
                            placeholder={``}
                            fieldLabel={"Drop Off Location"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>



                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vehicle_type}
                            fieldName="vehicle_type"
                            placeholder={``}
                            fieldLabel={"Vechicle Type"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.grand_total}
                            fieldName="grand_total"
                            placeholder={``}
                            fieldLabel={"Grand Total"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    {id && <Grid item xs={12} lg={6}>
                        <Typography letterSpacing={.5} px={'3px'} mb={'3px'}
                            sx={{
                                fontSize: {
                                    lg: 16,
                                    md: 14,
                                    sm: 12,
                                    xs: 11,
                                },
                                fontFamily: `'Poppins' sans-serif`,

                            }}
                        >{'Images'}

                        </Typography>
                        {imagePreview && imagePreview?.length > 0 &&
                            <>
                                <Box display={'flex'} gap={2} style={{ height: '200px', overflow: 'auto' }} >
                                    {(imagePreview && Array.isArray(imagePreview)) && imagePreview?.map((res: any, i: number) => (
                                        <Box position={'relative'}>
                                            <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 100, height: 100, }} />

                                        </Box>

                                    ))}
                                </Box>
                            </>
                        }

                    </Grid>}

                </Grid>
            </CustomBox>
            <CustomBox title='Payment & Order'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            disabled={true}
                            type='text'
                            control={control}
                            error={errors.payment_type}
                            fieldName="payment_type"
                            placeholder={``}
                            fieldLabel={"Payment Method"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={paymentMethodSelect}
                            options={''}
                            onChangeValue={paymentMethodChange}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select PaymentMethod</>
                            </MenuItem>
                            {paymentMethodList && paymentMethodList.map((res: any) => (
                                <MenuItem value={res?.value}  >
                                    <Typography>{res?.name}</Typography>
                                </MenuItem>
                            ))}

                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            disabled={true}
                            control={control}
                            error={errors.payment_status}
                            fieldName="payment_status"
                            placeholder={``}
                            fieldLabel={"Payment Status"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={paymentStatusSelect}
                            options={''}
                            onChangeValue={paymentStatusChange}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select PaymentStatus</>
                            </MenuItem>
                            {paymentStatusList && paymentStatusList?.map((res: any) => (
                                <MenuItem value={res?.status_name}>
                                    <Typography>{res?.status_name}</Typography>
                                </MenuItem>
                            ))}


                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.order_status}
                            fieldName="order_status"
                            placeholder={``}
                            fieldLabel={"Order Status"}
                            selectvalue={""}
                            height={40}
                            disabled={true}
                            label={''}
                            size={16}
                            value={orderSelect}
                            options={''}
                            onChangeValue={orderStatusChange}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select OrderStatus</>
                            </MenuItem>
                            {orderList?.map((res: any) => (
                                <MenuItem value={res?.status_name}>{res?.status_name}</MenuItem>

                            ))}

                        </Customselect>
                    </Grid>
                </Grid>
            </CustomBox>
          


        </Box>
    )
}

export default index