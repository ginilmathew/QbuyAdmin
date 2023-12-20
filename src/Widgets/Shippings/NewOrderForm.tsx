
import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler, set } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import CustomImageUploader from '@/components/CustomImageUploader';
import Customselect from '@/components/Customselect';
import { useJsApiLoader } from "@react-google-maps/api";
import { axiosInstance, fetchData } from '@/CustomAxios';
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
import RefundModal from './Modal/RefundModal';
import CustomSingleSearch from '@/components/CustomSingleSearch';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import CustomSelectSearch from '@/components/CustomeSelectSearch';
import { debounce } from 'lodash';
import moment from 'moment';


type Inputs = {
    name: string,
    email: string,
    mobile: string,
    customer_group: string,
    order_type: string,
    payment_address_pickup_address: string,
    shipping_address_delivery_address: string,
    payment_type: string,
    order_status: string,
    comment: string;
    order_id: string;
    ridername: string,
    customer_comments: string,
    rider_email: string,
    rider_phone: string,
    payment_status: string;
    refund_amount: string;
    vendor_status: any
};

type props = {
    view?: any,
    res?: any,
    edit?: any,
    add?: any,
    onupdate?: any
}

const NewOrderForm = ({ view, res, edit, add, onupdate }: props) => {
    const router = useRouter()
    const idd = view ? view : res;
    const [patientArray, setPatientArray] = useState<any>([])
    const [orderhistory, setOrderhistory] = useState<any>()
    const [customerGroupSelect, setCustomerGroupSelect] = useState<string>('')
    const [ordertype, setordertype] = useState<any>("Slot based")
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
    const [rider_name, setrider_name] = useState<any>('')
    const [customer_id, setcustomer_id] = useState<any>('')
    const [customer_user_id, setcustomer_user_id] = useState<any>('')
    const [paymentMethodSelect, setPaymentMethodSelect] = useState<string>('')
    const [paymentStatusList, setPaymentStatusList] = useState<any>([])
    const [paymentStatusSelect, setPaymentStatusSelect] = useState<string>('')
    const [orderList, setOrderList] = useState<any>([])
    const [selectedcustmraddress, setselectedcustmraddress] = useState<any>("")
    const [orderSelect, setOrderSelect] = useState<string>('')
    const [orderhistoryList, setOrderHistoryList] = useState<any>([])
    const [orderhistorySelect, setOrderHistorySelect] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [orderviewList, setOrderViewList] = useState<any>(null)
    const [customerdetails, setcustomerdetails] = useState<any>('')
    const [vendor_statusP, setVendorStatusP] = useState<any>(null)
    const [defaultStatus, setDefaultStatus] = useState<any>(null)
    const [refundModal, setRefundModal] = useState<boolean>(false);
    const [storeList, setStoreList] = useState<any>(null)
    const [customerListAll, setcustomerListAll] = useState<any>([])
    const [dataa, setDataa] = useState<any>('')
    const [inputValue, setInputValue] = useState<any>('');
    const [productdetails, setproductdetails] = useState<any>()
    const [customerGroupData, setcustomerGroupData] = useState<any>('')
    const [platFomCharge, setplatFomCharge] = useState<any>('')
    const [customeraddressList, setcustomeraddressList] = useState<any>([]);
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
            payment_status: yup.string().max(60, 'payment status required'),
            payment_method: yup.string().max(60, 'payment method required'),
            // name:yup.string().required("name required")
            // email:yup.string().required("email required"),

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

    const CustomerAddressChange = (e: any) => {
        const { value } = e.target
        setValue("shipping_address_delivery_address", value?._id)
        setValue("customer_comments", value?.comments)
        setselectedcustmraddress(value?._id)

    }




    const getPlatFormCharge = async () => {

        try {

            const response = await fetchData('common/platformcharge')
            let { data } = response?.data
            console.log({ data });

            setplatFomCharge(data?.platformCharge)

        } catch (err) {
            toast.error("cant't find platform charge")


        }
    }
    useEffect(() => {
        getPlatFormCharge()
    }, []);



    // useEffect(() => {
    //      if (dataa ) {
    //         // customerDetails()
    //         setValue('name', dataa?.name)
    //         // setValue('user_id', data?.user_id)
    //         setValue('email', dataa?.email)
    //         setValue('mobile', dataa?.mobile)
    //         setcustomer_id(dataa?.customer_id)
    //         setcustomer_user_id(dataa?.customer_user_id)
    //         // setValue()
    //     }

    //     // if (inputValue.length === 0) {
    //     //     setValue('name', "")
    //     //     setValue('email', "")
    //     //     setValue('mobile', "")

    //     //     // setValue('user_id', "")
    //     // }
    // }, [dataa])

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

    const orderStatusChange = (e: any) => {
        const { value } = e.target;
        setOrderSelect(value);

    }


    const onChangeCustomer = async (value: any) => {

        let details = await axiosInstance.get(`admin/customer-details/searchcustomer`, {
            params: {
                "search": value
            }
        });


        let customers = details?.data?.data?.map((cus: any) => {
            return {
                name: cus?.name,
                mobile: cus?.mobile,
                email: cus?.email,
                customer_id: cus?.customer?._id,
                customer_user_id: cus?.customer?.user_id,
                customer_group: cus?.customer?.customer_group,
                customer_group_id: cus?.customer?.customer_group_id,
                _id: cus?._id,
                user_id: cus?.user_id
            }
        })



        console.log({ customers })


        setPatientArray(customers)

    }

    const PatientSearch = async (value: any, newvalue: any) => {

        if (!newvalue) {
            setValue('name', "")
            setValue('email', "")
            setValue('mobile', "")
            return false
        }
        setDataa(newvalue)
        console.log({ value, newvalue })
        //setDataa(newvalue)
        setValue('name', newvalue?.name)
        // setValue('user_id', data?.user_id)
        setValue('email', newvalue?.email)
        setValue('mobile', newvalue?.mobile)
        setValue("customer_group", newvalue?.customer_group)
        setcustomer_id(newvalue?.customer_id)
        setcustomer_user_id(newvalue?.customer_user_id)

        //console.log({dataa});

        try {
            const response = await fetchData(`admin/customer-details/search/${newvalue?.customer_id}`);
            console.log(response?.data?.data);
            const customerGroupId = response?.data?.data?.customer_group_id;
            //const matchingCustomerGroup = findMatchingCustomerGroup(customerGroupId);
            setcustomeraddressList(response?.data?.data?.users?.addresses)

            {
                customeraddressList?.map((res: any) => (
                    setValue('customer_comments', res?.comments)
                ))
            }

            // console.log({ customerGroupData });
            // console.log({ matchingCustomerGroup });

            // if (matchingCustomerGroup) {
            //     setValue("customer_group", matchingCustomerGroup);
            //     setCustomerGroupSelect(matchingCustomerGroup);
            // }
        } catch (err: any) {
            toast.error(err?.message);

        }

        console.log({ newvalue });

        // customerDetailsAddressGet()


    }

    const debouncedOnChange = useCallback(debounce(onChangeCustomer, 500), []);





    // const findMatchingCustomerGroup = (customerGroupId: any) => {
    //     if (Array.isArray(customerGroupData)) {
    //         return customerGroupData.find((group) => group?._id === customerGroupId);
    //     }
    //     return null;
    // };







    const PaymentStatusList = async () => {
        try {
            const response = await fetchData('common/payment-status-list');
            setPaymentStatusList(response?.data?.data)
        } catch (err) {

        }
    }












    useEffect(() => {
        setValue("order_type", ordertype)
    }, [])




    useEffect(() => {
        if (orderviewList) {
            setValue('name', orderviewList?.user?.name)
            setValue('mobile', orderviewList?.user?.mobile)
            setValue('email', orderviewList?.user?.email)
            setValue('order_id', orderviewList?.order_id)
            setValue('refund_amount', orderviewList?.refund_details?.refund_amount);
            setValue('ridername', orderviewList?.rider_each_order_settlement?.rider?.name)
            setrider_name(orderviewList?.rider_each_order_settlement?.rider?.name)
            // setValue('rider_email',orderviewList?.rider_each_order_settlement?.rider?.email)
            setValue('rider_phone', orderviewList?.rider_each_order_settlement?.rider?.mobile)
            // setValue('payment_address_pickup_address', `${orderviewList?.billaddress?.name ? orderviewList?.billaddress?.name : ''},${orderviewList?.billaddress?.area?.address ? orderviewList?.billaddress?.area?.address : ''},${orderviewList?.billaddress?.pincode ? orderviewList?.billaddress?.pincode : ''},${orderviewList?.billaddress?.mobile ? `${'Mob:'}${orderviewList?.billaddress?.mobile}` : ''}`)
            setValue('shipping_address_delivery_address', `${orderviewList?.shipaddress?.name ? orderviewList?.shipaddress?.name : ''},${orderviewList?.shipaddress?.area?.address ? orderviewList?.shipaddress?.area?.address : ''},${orderviewList?.shipaddress?.pincode ? orderviewList?.shipaddress?.pincode : ''},
            ${orderviewList?.shipaddress?.mobile ? `${'Mob:'}${orderviewList?.shipaddress?.mobile}` : ''}`)
            setPaymentMethodSelect(orderviewList?.payment_type);
            setPaymentStatusSelect(orderviewList?.payment_status);
            setValue("payment_type", orderviewList.payment_type);
            setValue("payment_status", orderviewList?.payment_status);
            SetDeliveryCharge(orderviewList?.delivery_charge)
            setVendorStatusP([...orderviewList?.vendor_status])
        }

    }, [orderviewList])






    useEffect(() => {
        PaymentStatusList()
    }, [])



    const SubmitOrder = async (data: any) => {




        //return false;




        //console.log(selectedcustmraddress, "id");

        if (!data?.shipping_address_delivery_address) {
            toast.error("Shipping Address/Delivery Address required")
            return
        }
        if (!data?.payment_type) {
            toast.error("Payment method required")
            return
        }
        if (!data?.payment_status) {
            toast.error("Payment status required")
            return
        }
        if (!productdetails?.product_details?._id) {
            toast.error("Please Add Product")
            return
        }


        let store = productdetails?.product_details?.productDetails?.map((prod: any) => prod?.vendor?._id)



        let resultadd = {
            id: productdetails?.product_details?._id,
            user_id: dataa?.customer_user_id,
            name: data?.name,
            payment_status: data?.payment_status,
            payment_type: data?.payment_type,
            store: store,
            delivery_charge: productdetails?.delivery_charge,
            shipping_address: data?.shipping_address_delivery_address,
            billing_address: data?.shipping_address_delivery_address,
            total_amount: productdetails?.total_amount,
            type: process.env.NEXT_PUBLIC_TYPE,
            delivery_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            delivery_type: 'Slot based',
            platform_charge: platFomCharge
        }


        console.log({resultadd});

        //return false;



        // let resultadd = productdetails?.product_details?.productDetails?.map((itm: any) => ({
        //     id: productdetails?.product_details?._id,
        //     user_id: dataa?.customer_user_id,
        //     name: data?.name,
        //     payment_status: data?.payment_status,
        //     payment_type: data?.payment_type,
        //     store: [itm?.vendor?._id],
        //     franchise: itm?.vendor?.franchise_id,
        //     delivery_charge: productdetails?.delivery_charge,
        //     shipping_address: selectedcustmraddress,
        //     billing_address: selectedcustmraddress,
        //     total_amount: productdetails?.total_amount,
        //     type: process.env.NEXT_PUBLIC_TYPE,
        //     delivery_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        //     delivery_type: ordertype,
        //     platform_charge: platFomCharge


        // }));




        try {
            await postData('admin/order/create', resultadd);
            router.push('/shipments');
            toast.success('Order created Successfully');
        } catch (err) {
            let message = 'Unknown Error';
            if (err instanceof Error) message = err.message;
            reportError({ message });
            toast.error(message);
        }


    }




    if (loader) {
        return <><CustomLoader /></>
    }





    const handleApiSuccess = (newAddedProduct: string) => {
        setproductdetails(newAddedProduct)

    };


    return (
        <Box>
            <CustomBox title='Customer Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomSelectSearch
                            control={control}
                            error={errors.name}
                            fieldName="patient"
                            fieldLabel="Search Customer"
                            background="#FFFFFF"
                            height="40px"
                            size="16px"
                            options={patientArray ? patientArray : []}
                            getOptionLabel={({ name, mobile }: any) => `${name}  ${mobile}`}
                            onChangeValue={PatientSearch}
                            //inputValue={inputValue}
                            placeholder='Search by Name,Mobile'
                            onInputChange={(e: any) => {
                                if (e?.target?.value?.length > 0) {
                                    debouncedOnChange(e?.target?.value)
                                }
                                else {
                                    setValue('name', "")
                                    setcustomer_id("")
                                    setcustomer_user_id("")
                                    setValue('email', "")
                                    setValue('mobile', "")
                                    setcustomeraddressList([])
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="email"
                            placeholder={``}
                            view={true}
                            fieldLabel={"Email Address"}
                            disabled={true}

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
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Order Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.shipping_address_delivery_address}
                            fieldName="shipping_address_delivery_address"
                            disabled={view ? true : false}
                            placeholder={``}
                            fieldLabel={"Shipping Address or Delivery Address"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            //value={selectedcustmraddress}
                            options={''}
                            onChangeValue={CustomerAddressChange}
                            background={'#fff'}
                        >
                            {customeraddressList?.map((res: any) => (
                                <MenuItem value={res}>
                                    {`${res?.name ? res?.name + ',' : null} ${res?.mobile ? res?.mobile + ',' : null}, ${res?.area?.address}`}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={6}>

                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_comments}
                            fieldName="customer_comments"
                            placeholder={``}
                            fieldLabel={"Comments"}
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
                            view={idd ? true : false}
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
                            view={idd ? true : false}
                            defaultValue={''}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
            {<CustomBox title='Product Details'>
                {
                    <ShippingTable res={orderviewList} onApiSuccess={handleApiSuccess} readonly={res} id={idd} SetDeliveryCharge={SetDeliveryCharge} setStoreList={setStoreList} />}
            </CustomBox>}




            {(res || add) && <Box py={3} display={'flex'} justifyContent={'center'}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={res ? 'Update Order' : 'Add Order'}
                    disabled={loading}
                    onClick={handleSubmit(SubmitOrder)} />
            </Box>}


        </Box>
    )
}

export default NewOrderForm

