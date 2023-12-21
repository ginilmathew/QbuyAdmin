
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
import RefundModal from './Modal/RefundModal';
import CustomSingleSearch from '@/components/CustomSingleSearch';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import CustomSelectSearch from '@/components/CustomeSelectSearch';


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
    customer_comments:string,
    rider_email:string,
    rider_phone:string,
    payment_status: string;
    refund_amount: string;
    vendor_status: any,
    refund_details: any
};

type props = {
    view?: any,
    res?: any,
    edit?: any,
    add?: any,
    onupdate?: any
}

const ShippingOrderForm = ({ view, res, edit,add, onupdate }: props) => {
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
    const [storeList,setStoreList]=useState<any>(null)
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

    console.log({storeList})

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
           const {value}=e.target
           console.log(value);
           setValue("shipping_address_delivery_address",value)
           setselectedcustmraddress(value)
           
    }
    const orderTypeChange = (e: any) => {
        if(!idd){

        }

    }
    console.log({res});
    
    const fetchCustomerGroupOptions = async () => {
        try {
            const response = await fetchData("/admin/customer-group");
            const customerGroupData = response.data.data;
            console.log("API Response:", customerGroupData);
            setcustomerGroupData(customerGroupData)
        } catch (error) {
            console.error("Failed to fetch customer groups:", error);
            toast.error("Failed to fetch customer groups");
        } };

        const getPlatFormCharge = async () => {
     
            try {
                
                const response = await fetchData('common/platformcharge')
                let { data } = response?.data
                console.log({data});
                
                 setplatFomCharge(data?.platformCharge)
    
            } catch (err) {
                toast.error("cant't find platform charge")
             
    
            } 
        }
    useEffect(() => {
        fetchCustomerGroupOptions();
        getPlatFormCharge()
    }, []);
    useEffect(() => {
         if (dataa ) {
            // customerDetails()
            setValue('name', dataa?.name)
            // setValue('user_id', data?.user_id)
            setValue('email', dataa?.email)
            setValue('mobile', dataa?.phonenumber)
            setcustomer_id(dataa?.customer_id)
            setcustomer_user_id(dataa?.customer_user_id)
            // setValue()
        }
    
        if (inputValue.length === 0) {
            setValue('name', "")
            setValue('email', "")
            setValue('mobile', "")
            
            // setValue('user_id', "")
        }
    }, [dataa])

    const paymentMethodChange = (e: any) =>
     {
        const { value } = e.target;
        setValue("payment_type", value)
        setPaymentMethodSelect(value)
     }

    const paymentStatusChange = (e: any) =>
     {
        const { value } = e.target;
        setValue("payment_status", value)
        setPaymentStatusSelect(value)
     }

    const orderStatusChange = (e: any) => 
    {
        const { value } = e.target;
        setOrderSelect(value);

    }

    useEffect(() => {
        if(dataa)
        {
            customerDetailsAddressGet()
        }
        
    }, [dataa])


    const customerDetailsAddressGet = async () => {
        const id = dataa?.customer_id;
        console.log({dataa});
        
        try {
                const response = await fetchData(`admin/customer-details/search/${id}`);
            console.log(response?.data?.data);
            const customerGroupId = response?.data?.data?.customer_group_id;
            const matchingCustomerGroup = findMatchingCustomerGroup(customerGroupId);
            setcustomeraddressList(response?.data?.data?.users?.addresses)
           
            {customeraddressList?.map((res: any) => (
                setValue('customer_comments',res?.comments)
            ))}
          
           console.log({customerGroupData});
           console.log({matchingCustomerGroup});
           
           if (matchingCustomerGroup) {
            setValue("customer_group", matchingCustomerGroup);
            setCustomerGroupSelect(matchingCustomerGroup);
        }
           
         
            
            // if (Array.isArray(customerGroupData)) {
            //     // Check if customer group ID matches any customer group
            //     const matchingCustomerGroup = customerGroupData.find(
            //         (group) => group?.customer_group_id === response?.data?.data?.customer_group_id
            //     );
            //  console.log({matchingCustomerGroup});
    
            //     // If a match is found, update the customer group select state
            //     if (matchingCustomerGroup) {
            //      setValue("customer_group",matchingCustomerGroup)   ;
            //      setCustomerGroupSelect(matchingCustomerGroup?.name)
            //     }
            // }
          
        } catch (err: any) {
            toast.error(err?.message);
           
        } 
    };
    const findMatchingCustomerGroup = (customerGroupId:any) => {
        if (Array.isArray(customerGroupData)) {
            return customerGroupData.find((group) => group?._id === customerGroupId);
        }
        return null;
    };
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
    const Alertrider = async () => {

        let value = {
            order_id: idd,
         
        }
        try {
            setLoading(true)
            await postData('admin/shipment/rider-alert', value)
            toast.success('Alert Send Successfully')
            // router.push('/shipments')
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
            const fetch = await fetchData('common/vendor-order-status-list');

            setVendorStatusList(fetch?.data?.data)

        } catch (err: any) {


        }

    }


    const vendorStatusChange = (e: any, index: number, res: any) => {
        const { value } = e.target;
        vendor_statusP[index]['status'] = value;
        setVendorStatusP(vendor_statusP)
    }
    // const customerList = async () => {
     
    //     try {
    //         const fetch = await fetchData('admin/customer-details/list');
    //         let result = fetch?.data?.data?.map((userData: any) => ({
    //             name: userData?.users?.name,
    //             email: userData?.users?.email,
    //             phonenumber: userData?.users?.mobile,
    //             customer_id:userData?._id,
    //             customet_user_id:userData?.user_id
                 
               
    //        }));
    //          setcustomerListAll(result);
    //     } catch (err: any) {
    //         // Handle errors here
          
    //     }
    // };

   

    // const GetPlatformCharge = async () => {
    //     try {

    //         const response = await fetchData('common/platformcharge')
    //         setplatformList(response?.data?.data)

    //     } catch (err) {

    //     }
    // }

    const HandleopenRefund = useCallback(() => {
        setRefundModal(true)
    }, [refundModal])

    const HandleCloserefund = useCallback(() => {
        setRefundModal(false)
    }, [refundModal]);




    useEffect(() => {
        vendorStatus();
        // GetPlatformCharge()
        //customerList()
        setValue("order_type",ordertype)
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
            setValue('rider_phone',orderviewList?.rider_each_order_settlement?.rider?.mobile)
            // setValue('payment_address_pickup_address', `${orderviewList?.billaddress?.name ? orderviewList?.billaddress?.name : ''},${orderviewList?.billaddress?.area?.address ? orderviewList?.billaddress?.area?.address : ''},${orderviewList?.billaddress?.pincode ? orderviewList?.billaddress?.pincode : ''},${orderviewList?.billaddress?.mobile ? `${'Mob:'}${orderviewList?.billaddress?.mobile}` : ''}`)
            setValue('shipping_address_delivery_address', `${orderviewList?.shipaddress?.name ? orderviewList?.shipaddress?.name : ''},${orderviewList?.shipaddress?.area?.address ? orderviewList?.shipaddress?.area?.address : ''},${orderviewList?.shipaddress?.pincode ? orderviewList?.shipaddress?.pincode : ''},
            ${orderviewList?.shipaddress?.mobile ? `${'Mob:'}${orderviewList?.shipaddress?.mobile}` : ''}`)
            setPaymentMethodSelect(orderviewList?.payment_type);
            setPaymentStatusSelect(orderviewList?.payment_status);
            setValue("payment_type", orderviewList.payment_type);
            setValue("payment_status", orderviewList?.payment_status);
            setValue("refund_details", orderviewList?.refund_details ? `Transaction Id: ${orderviewList?.refund_details?.transaction_id}, Refund Amount:  ${orderviewList?.refund_details?.refund_amount}, Remarks: ${orderviewList?.refund_details?.refund_note}` : '')
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
    

     
       if(res){
        let uniqueStore: any[] = Array.from(new Set(storeList));

    

        let result = {
            id: idd,
            delivery_charge: Math.ceil(deliveryCharge),
            ...data,
            payment_method: data?.payment_type,
            vendor_status: vendor_statusP,
            platform_charge: orderviewList?.platform_charge,
            store:uniqueStore,
          }
  
        
        try {

            await postData('admin/order/update', result);
            //router.push('/shipments')
            if(onupdate){
                onupdate()
            }
            
            toast.success('Order Updated Successfully')
            router.push('/shipments')

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }
       }
       else {
       
    


        let resultadd = productdetails?.product_details?.productDetails?.map((itm: any) => ({
            id: productdetails?.product_details?._id,
            user_id: dataa?.customet_user_id,
            name: data?.name,
            payment_status: data?.payment_status,
            payment_type: data?.payment_type,
            store: [itm?.vendor?._id],
            franchise: itm?.vendor?.franchise_id,
            delivery_charge: productdetails?.delivery_charge,
            shipping_address:selectedcustmraddress,
            billing_address:selectedcustmraddress,
            total_amount: productdetails?.total_amount,
            type:process.env.NEXT_PUBLIC_TYPE,
            delivery_date:new Date().toISOString().slice(0, 19).replace("T", " "),
            delivery_type:ordertype ,
            platform_charge:platFomCharge
          
            
        }));

 
  
        if(!selectedcustmraddress)
        {
            toast.error("Shipping Address/Delivery Address required")
            return
        }
        if(! data?.payment_type){
         toast.error("Payment method required")
         return
        }
        if(!data?.payment_status){
         toast.error("Payment status required")
         return
        }
        if(!productdetails?.product_details?._id){
         toast.error("Please Add Product")
         return
        }
        try {
            await postData('admin/order/create', resultadd[0]);
            router.push('/shipments');
            toast.success('Order created Successfully');
        } catch (err) {
            let message = 'Unknown Error';
            if (err instanceof Error) message = err.message;
            reportError({ message });
            toast.error(message);
        }
    }
          

    }




    if (loader) {
        return <><CustomLoader /></>
    }

const onChangeRelatedproduct = (value: any) => {
    let result = value && value?.map((res: any) => ({
        _id: res?._id,
        name: res?.title
    }
    ))

    // setRecomendedProductArray(result)
}
const PatientSearch = (value:any, newvalue:any) => {
    setDataa(newvalue)
    console.log({newvalue});
    
    // customerDetailsAddressGet()
    
    
}


const PatientOnchangeInput = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
  
    const val = {
      key: newInputValue,
    };
  

     const filteredPatients = customerListAll?.filter((patient:any) => {
      const { name, phonenumber } = patient;
  
      const nameMatches = name?.toLowerCase().startsWith(newInputValue?.toLowerCase());
  
     
      const isNumeric = !isNaN(newInputValue);
      const phoneMatches = isNumeric && phonenumber?.includes(newInputValue);
  
      return nameMatches || phoneMatches;
    });
   
   


   setPatientArray(filteredPatients)

   
   
    
  };
 
  const handleApiSuccess = (newAddedProduct: string) => {
    setproductdetails(newAddedProduct)

  };
console.log(  orderviewList?.refund_details?.refund_amount);


    return (
        <Box>
            <CustomBox title='Customer Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                    <Grid item xs={12} lg={12} >
                    {idd ? (
                // Render CustomInput if idd is present
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
            ) : (
                // Render CustomSelectSearch if idd is not present
                <CustomSelectSearch
                    control={control}
                    error={errors.name}
                    fieldName="patient"
                    fieldLabel="Search Customer"
                    background="#FFFFFF"
                    height="40px"
                    size="16px"
                    options={patientArray}
                    getOptionLabel={({ name, phonenumber }: any) => `${name}  ${phonenumber}`}
                    onChangeValue={PatientSearch}
                    inputValue={inputValue}
                    placeholder='Search by Name,Mobile'
                    onInputChange={PatientOnchangeInput}
                />
            )}
            </Grid>
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
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
                            disabled={view ? true : false}
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            selectvalue={customerGroupSelect}
                            height={40}
                            label={''}
                            size={16}
                        
                            value={customerGroupSelect}
                            options={customerGroupData}
                            onChangeValue={orderTypeChange}
                            // onChangeValue={CustomerGroupChange}
                            background={'#fff'}
                        >
                           {/* {customerGroupData?.map((group:any) => (
                                <MenuItem
                                    key={group._id}
                                    value={group._id}
                                >
                                    {group.name}
                                </MenuItem>
                            ))} */}
                               
                        </Customselect>
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Order Details'>
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
                            selectvalue={ordertype}
                            height={40}
                            label={''}
                            size={16}
                            value={ordertype}
                            options={ordertype}
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
                       {idd?(
                       <CustomTextarea
                            control={control}
                            error={errors.shipping_address_delivery_address}
                            fieldName="shipping_address_delivery_address"
                            placeholder={``}
                            fieldLabel={"Shipping Address or Delivery Address"}
                            disabled={false}
                            view={idd ? true : false}
                            defaultValue={''}
                        />):
                       ( <Customselect
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
                        value={selectedcustmraddress}
                        options={''}
                        onChangeValue={CustomerAddressChange}
                        background={'#fff'}
                    >
                         {customeraddressList?.map((res: any) => (
                                    <MenuItem value={res?._id}>{res?.fullData}</MenuItem>
                                ))}
                    </Customselect>
                        ) }
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                       <CustomTextarea
                            control={control}
                            error={errors.refund_details}
                            fieldName="refund_details"
                            placeholder={``}
                            fieldLabel={"Refund Details"}
                            disabled={false}
                            view={true}
                            defaultValue={``}
                        />
                    </Grid>
                </Grid>
                {orderviewList?.refundAmount &&
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} py={1}>

                        <Custombutton
                            btncolor='#d39a58'
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Refund'}
                            disabled={false}
                            onClick={HandleopenRefund} 
                        />
                    </Box>}

            </CustomBox>
            <CustomBox title='Customer Instructions'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={2.5}>
                      
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_comments}
                            fieldName="customer_comments"
                            placeholder={``}
                            fieldLabel={"Comments"}
                            disabled={false}
                            view={idd?true:false}
                            defaultValue={''}
                        />
                    
                    </Grid></Grid>
                </CustomBox>
            <CustomBox title='Rider Details'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={2.5}>
                      
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.ridername}
                            fieldName="ridername"
                            placeholder={``}
                            fieldLabel={"Rider Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    
                        </Grid>
                        {/* <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.rider_email}
                                fieldName="rider_email"
                                placeholder={``}
                                fieldLabel={"Email Address"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />

                        </Grid> */}
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.rider_phone}
                                fieldName="rider_phone"
                                placeholder={``}
                                fieldLabel={"Mobile Number"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />

                        </Grid>

                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 1 }}>
                        <Custombutton
                            btncolor='#D35858'
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Alert Rider'}
                            disabled={rider_name ?false:true}
                            onClick={Alertrider} />
                    </Box>
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
                            view={idd?true:false}
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
                            view={idd?true:false}
                            defaultValue={''}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
         {  <CustomBox title='Product Details'>
                { 
                    <ShippingTable res={orderviewList}  onApiSuccess={handleApiSuccess}  readonly={res} id={idd} SetDeliveryCharge={SetDeliveryCharge} setStoreList={setStoreList}/>}
            </CustomBox>}
      {idd&&
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

            </CustomBox>}
            {orderviewList?.refund_completed_status &&
            <CustomBox title='Refund Details'>
                <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                
                                <TableCell align="center">Refund Amount </TableCell>
                                <TableCell align="center">Refund Note</TableCell>
                                <TableCell align="center">Refund Id</TableCell>
                                {res &&
                                    <TableCell align="center">Change Status</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        
                                <TableRow
                                    // key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                   
                                    <TableCell align="center" component="th" scope="row">
                                        {orderviewList?.refund_details?.refund_amount}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {orderviewList?.refund_details?.refund_note}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {orderviewList?.refund_details?.transaction_id}
                                    </TableCell>
                               
                                </TableRow>
                             
                        </TableBody>
                    </Table>
                </TableContainer>

            </CustomBox>}
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
            {(res || add ) && <Box py={3} display={'flex'} justifyContent={'center'}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={ res?'Update Order':'Add Order'}
                    disabled={loading}
                    onClick={handleSubmit(SubmitOrder)} />
            </Box>}

            {refundModal && <RefundModal open={refundModal} handleClose={HandleCloserefund} res={orderviewList} functioncall={getVenderListShow} />}
        </Box>
    )
}

export default ShippingOrderForm

