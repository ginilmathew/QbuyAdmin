
import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler, set } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import CustomImageUploader from '@/components/CustomImageUploader';
import Customselect from '@/components/Customselect';
import { useJsApiLoader } from "@react-google-maps/api";
import { fetchData } from '@/CustomAxios';
import CustomTimepicker from '@/components/CustomTimepicker';
import { postData } from '@/CustomAxios';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import moment from 'moment'
import CustomMultiselect from '@/components/CustomMultiselect';
import Maps from '@/components/maps/maps';
import Polygon from '@/components/maps/Polygon';
import { useRouter } from 'next/router';
import { IMAGE_URL } from '../../Config/index';
import CustomTextarea from '@/components/CustomTextarea';
import CustomLoader from '@/components/CustomLoader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ShippingTable from './shippingViewTable';
import HistoryTable from './shippingViewTable/History';


type Inputs = {
    name: string,
    email: string,
    mobile: string,
    customer_group: string,
    order_type: string,
    payment_address_pickup_address: string,
    shipping_address_delivery_address: string,
    payment_method: string,
    order_status: string,
    comment: string
};

type props = {
    view?: any,
    res?: any
}

const ShippingOrderForm = ({ view, res }: props) => {
    const router = useRouter()

    const idd = view ? view : res;





    const [orderhistory, setOrderhistory] = useState<any>()
    const [customerGroupSelect, setCustomerGroupSelect] = useState<string>('')
    const [paymentMethodList, setPaymentMethodList] = useState<any>([])
    const [paymentMethodSelect, setPaymentMethodSelect] = useState<string>('')
    const [paymentStatusList, setPaymentStatusList] = useState<any>([])
    const [paymentStatusSelect, setPaymentStatusSelect] = useState<string>('')
    const [orderList, setOrderList] = useState<any>([])
    const [orderSelect, setOrderSelect] = useState<string>('')
    const [orderhistoryList, setOrderHistoryList] = useState<any>([])
    const [orderhistorySelect, setOrderHistorySelect] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [orderviewList, setOrderViewList] = useState<any>(null)
    const [orderStatusSelect, setOrderStatus] = useState<any>([
        {
            value: "active",
            name: "Active"
        },
        {
            value: "completed",
            name: "Completed"
        },
        {
            value: "canceled",
            name: "Canceled"
        },
    ]
    )
    const [OrderStatusList, setOrderStatusList] = useState([])






    const schema = yup
        .object()
        .shape({
            comment: yup.string().max(60, 'Maximum Character Exceeds').required('Comment is Required'),
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

        });


    const CustomerGroupChange = (e: any) => {

    }
    const orderTypeChange = (e: any) => {

    }

    const paymentMethodChange = (e: any) => {

    }

    const paymentStatusChange = (e: any) => {

    }

    const orderStatusChange = (e: any) => {
        const { value } = e.target;
        setOrderSelect(value);

    }


    const getVenderListShow = async () => {

        try {
            setLoader(true)
            const response = await fetchData(`admin/order/show/${idd}`)
            setOrderViewList(response?.data?.data)
            setLoader(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)

        } finally {
            setLoader(false)
        }

    }

    const orderStatusList = async () => {
        try {
            setLoader(true)
            const response = await fetchData('common/order-status-list')
            setOrderList(response?.data?.data)
            setLoader(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }

    const ChangeOrderStatus = async () => {
        console.log(idd)
        let value = {
            order_id: idd,
            status: orderSelect,
            comments: getValues('comment')
        }
        try {
            setLoading(true)
            await postData('admin/order/status', value)
            toast.success('Order Updated Successfully')
            router.push('/shipments')
            setLoading(false)
        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)
        } finally {
            setLoading(false)
        }

    }





    useEffect(() => {
        if (orderviewList) {
            setValue('name', orderviewList?.user?.name)
            setValue('mobile', orderviewList?.user?.mobile)
            setValue('email', orderviewList?.user?.email)
            // setValue('payment_address_pickup_address', `${orderviewList?.billaddress?.name ? orderviewList?.billaddress?.name : ''},${orderviewList?.billaddress?.area?.address ? orderviewList?.billaddress?.area?.address : ''},${orderviewList?.billaddress?.pincode ? orderviewList?.billaddress?.pincode : ''},${orderviewList?.billaddress?.mobile ? `${'Mob:'}${orderviewList?.billaddress?.mobile}` : ''}`)
            setValue('shipping_address_delivery_address', `${orderviewList?.shipaddress?.name ? orderviewList?.shipaddress?.name : ''},${orderviewList?.shipaddress?.area?.address ? orderviewList?.shipaddress?.area?.address : ''},${orderviewList?.shipaddress?.pincode ? orderviewList?.shipaddress?.pincode : ''},
            ${orderviewList?.shipaddress?.mobile ? `${'Mob:'}${orderviewList?.shipaddress?.mobile}` : ''}`)
        }

    }, [orderviewList])




    useEffect(() => {
        if (idd) {
            getVenderListShow()

        }
    }, [idd])

    useEffect(() => {
        orderStatusList()
    }, [])




    if (loader) {
        return <><CustomLoader /></>
    }

    return (
        <Box>
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
                            view={false}
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
                            view={false}
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
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={customerGroupSelect}
                            options={''}
                            onChangeValue={CustomerGroupChange}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Group</>
                            </MenuItem>

                        </Customselect>
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Customer Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.order_type}
                            fieldName="order_type"
                            placeholder={``}
                            fieldLabel={"Order Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={customerGroupSelect}
                            options={''}
                            onChangeValue={orderTypeChange}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Order</>
                            </MenuItem>
                        </Customselect>
                    </Grid>
                    {/* <Grid item xs={12} lg={2.5}>
                        <CustomTextarea
                            control={control}
                            error={errors.payment_address_pickup_address}
                            fieldName="payment_address_pickup_address"
                            placeholder={``}
                            fieldLabel={"Payment Address or Pickup Address"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid> */}
                    <Grid item xs={12} lg={2.5}>
                        <CustomTextarea
                            control={control}
                            error={errors.shipping_address_delivery_address}
                            fieldName="shipping_address_delivery_address"
                            placeholder={``}
                            fieldLabel={"Shipping Address or Delivery Address"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>

            </CustomBox>
            <CustomBox title='Payment Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
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

                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
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

                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Invoice No."}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Reward Points Received"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Product Details'>
                {orderviewList &&
                    <ShippingTable res={orderviewList} />}
            </CustomBox>
            {idd && <HistoryTable res={orderviewList?.order_history} />}

            {(idd && !orderviewList?.order_history?.some((res: any) => res?.status === 'cancelled' || res?.status === 'completed')) &&
                <CustomBox title='Add Order History'>
                    <Grid container spacing={2}>
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
                        <Grid item xs={12} lg={5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.comment}
                                fieldName="comment"
                                placeholder={``}
                                fieldLabel={"comment"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />

                        </Grid>

                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 1 }}>
                        <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Update Status'}
                            disabled={loading}
                            onClick={ChangeOrderStatus} />
                    </Box>
                </CustomBox>}
            {/* <Box py={3}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Add Order'}
                    disabled={loading}
                    onClick={null} />
            </Box> */}
        </Box>
    )
}

export default ShippingOrderForm