
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

import { useRouter } from 'next/router';

import CustomTextarea from '@/components/CustomTextarea';
import CustomLoader from '@/components/CustomLoader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
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
    comment: string;
    order_id: string;
    payment_status: string;
    vendor_status: any
};

type props = {
    view?: any,
    res?: any,
    edit?: any
}

const ShippingOrderForm = ({ view, res, edit }: props) => {
    const router = useRouter()

    const idd = view ? view : res;
    const [orderhistory, setOrderhistory] = useState<any>()
    const [customerGroupSelect, setCustomerGroupSelect] = useState<string>('')
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
    const [vendor_statusP, setVendorStatusP] = useState<any>(null)
    const [defaultStatus, setDefaultStatus] = useState<any>(null)




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
    const [deliveryCharge, SetDeliveryCharge] = useState<any>(null)
    const [vendorStatusList, setVendorStatusList] = useState<any>([])
    const [platformList, setplatformList] = useState<any>(null);


    const schema = yup
        .object()
        .shape({
            comment: yup.string().max(60, 'Maximum Character Exceeds').nullable(),
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
        const { value } = e.target;
        setValue("payment_method", value)
        setPaymentMethodSelect(value)

    }

    const paymentStatusChange = (e: any) => {
        const { value } = e.target;
        setValue("payment_status", value)
        setPaymentStatusSelect(value)

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

    const PaymentStatusList = async () => {
        try {
            const response = await fetchData('common/payment-status-list');
            setPaymentStatusList(response?.data?.data)
        } catch (err) {

        }
    }

    const vendorStatus = async () => {
        try {
            const fetch = await fetchData('common/order-status-list');

            setVendorStatusList(fetch?.data?.data)

        } catch (err: any) {


        }

    }


    const vendorStatusChange = (e: any, index: number, res: any) => {
        const { value } = e.target;
        vendor_statusP[index]['status'] = value;
        setVendorStatusP(vendor_statusP)
    }


    const GetPlatformCharge = async () => {
        try {

            const response = await fetchData('common/platformcharge')
            setplatformList(response?.data?.data)

        } catch (err) {

        }
    }



    useEffect(() => {
        vendorStatus();
        GetPlatformCharge()
    }, [])





    useEffect(() => {
        if (orderviewList) {
            setValue('name', orderviewList?.user?.name)
            setValue('mobile', orderviewList?.user?.mobile)
            setValue('email', orderviewList?.user?.email)
            setValue('order_id', orderviewList?.order_id)
            // setValue('payment_address_pickup_address', `${orderviewList?.billaddress?.name ? orderviewList?.billaddress?.name : ''},${orderviewList?.billaddress?.area?.address ? orderviewList?.billaddress?.area?.address : ''},${orderviewList?.billaddress?.pincode ? orderviewList?.billaddress?.pincode : ''},${orderviewList?.billaddress?.mobile ? `${'Mob:'}${orderviewList?.billaddress?.mobile}` : ''}`)
            setValue('shipping_address_delivery_address', `${orderviewList?.shipaddress?.name ? orderviewList?.shipaddress?.name : ''},${orderviewList?.shipaddress?.area?.address ? orderviewList?.shipaddress?.area?.address : ''},${orderviewList?.shipaddress?.pincode ? orderviewList?.shipaddress?.pincode : ''},
            ${orderviewList?.shipaddress?.mobile ? `${'Mob:'}${orderviewList?.shipaddress?.mobile}` : ''}`)
            setPaymentMethodSelect(orderviewList?.payment_type);
            setPaymentStatusSelect(orderviewList?.payment_status);
            setValue("payment_method", orderviewList.payment_type);
            setValue("payment_status", orderviewList?.payment_status);
            SetDeliveryCharge(orderviewList?.delivery_charge)
            setVendorStatusP([...orderviewList?.vendor_status])
        }

    }, [orderviewList])




    useEffect(() => {
        if (idd) {
            getVenderListShow()
        }
    }, [idd])


    useEffect(() => {
        orderStatusList()
        PaymentStatusList()
    }, [])


    const SubmitOrder = async (data: any) => {

    
        let result = {
            id: idd,
            delivery_charge: Math.ceil(deliveryCharge),
            ...data,
            vendor_status: vendor_statusP,
            platform_charge: platformList?.platformCharge,
        }
        try {

            const response = await postData('admin/order/update', result);
            router.push('/shipments')
            toast.success('Order Updated Successfully')

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }

    }




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
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
                            disabled={view ? true : false}
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
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.order_id}
                            fieldName="order_id"
                            placeholder={``}
                            fieldLabel={"Order ID"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            disabled={true}
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
                            view={idd ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>

            </CustomBox>
            <CustomBox title='Payment Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.payment_method}
                            fieldName="payment_method"
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
                            disabled={view || (orderviewList?.payment_status === "completed" || orderviewList?.payment_status === "cancelled") ? true : false}
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
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="invoice"
                            placeholder={``}
                            fieldLabel={"Invoice No."}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="reward_point"
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
                    <ShippingTable res={orderviewList} readonly={res} id={idd} SetDeliveryCharge={SetDeliveryCharge} />}
            </CustomBox>

            <CustomBox title='Vendor Status'>
                <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">Store Name</TableCell>
                                <TableCell align="center">Vendor Name</TableCell>
                                <TableCell align="center">Current Status</TableCell>
                                {res &&
                                    <TableCell align="center">Change Status</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendor_statusP && vendor_statusP?.map((resp: any, i: number) => (
                                <TableRow
                                    // key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {resp?.store_name}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {resp?.vendor_name}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {resp?.status}
                                    </TableCell>
                                    {res &&
                                        <TableCell align="center" component="th" scope="row">
                                            <select onChange={(e: any) => vendorStatusChange(e, i, resp)} style={{ cursor: 'pointer', background: '#fff', border: '1px solid #f5f5f5', padding: 10 }}>
                                                <option> <em> Select Status</em></option>

                                                {vendor_statusP && vendorStatusList?.filter((res: any) => res?.status_name !== "completed" && res?.status_name !== "pickedup").map((list: any) => (
                                                    <option value={list?.status_name}>{list?.status_name}</option>
                                                ))}
                                            </select>
                                        </TableCell>}
                                </TableRow>))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </CustomBox>
            {idd && <HistoryTable res={orderviewList?.order_history} />}

            {(res && !orderviewList?.order_history?.some((res: any) => res?.status === 'cancelled' || res?.status === 'completed')) &&
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
                                view={view ? true : false}
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
            {res && <Box py={3} display={'flex'} justifyContent={'center'}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Update Order'}
                    disabled={loading}
                    onClick={handleSubmit(SubmitOrder)} />
            </Box>}
        </Box>
    )
}

export default ShippingOrderForm