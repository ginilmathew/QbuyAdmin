
import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../../../Widgets/CustomBox'
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
import { Avatar } from '@mui/material';



import { useRouter } from 'next/router';

import CustomTextarea from '@/components/CustomTextarea';
import CustomLoader from '@/components/CustomLoader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import CustomDatePicker from '@/components/CustomDatePicker';
import { CustomMultipleImageUploader } from '@/components/CustomMultipleImageUploder';
import { IMAGE_URL } from '@/Config';
// import ShippingTable from './shippingViewTable';
// import HistoryTable from './shippingViewTable/History';


type Inputs = {
    customer_name:string,
    email:string,
    mobile:number,
    assign_rider:string,
    customer_group:string,
    item_name: string,
    description: string,
    weight:number,
    vehicle_type: string,
    pickup_date: string,
    pickup_time: string,
    pickup_location: string,
    drop_off_location: string,
    image: string[],
    sub_total: string;
    extra_total: string;
    total_charge: string;
    store: any
};

type props = {
    view?: any,
    res?: any,
    edit?: any
}

const PickUp = ({ view, res, edit }: props) => {
    const router = useRouter()

    const idd = view ? view : res;
    console.log(idd);
    const [type, settype] = useState<string>("");
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
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
    const [multipleImage, setMultipleImage] = useState<any>([])

    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imagefile, setImagefile] = useState<null | File>(null)

    console.log({ orderviewList })
    const [deliveryCharge, SetDeliveryCharge] = useState<any>(null)
    const [vendorStatusList, setVendorStatusList] = useState<any>([])
    const [platformList, setplatformList] = useState<any>(null);
    const [defaultImage, setdefaultImage] = useState<any>([])


    const schema = yup
        .object()
        .shape({
        
//             customer_name: yup.string().required('Customer Name is required'),
//   email: yup.string().email('Invalid email').required('Email is required'),
//   mobile: yup.number().required('Mobile Number is required'),
//   customer_group: yup.string().required('Customer Group is required'),
  item_name: yup.string().required('Item Name is required'),
  description: yup.string().required('Description is required'),
  weight: yup.number().required('Weight is required'),
   vehicle_type: yup.string().required('Vehicle Type is required'),
//   pickup_date: yup.date().required('Pickup Date is required'),
//     pickup_time: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)').required('Pickup Time is required'),
  pickup_location: yup.string().required('Pickup Location is required'),
  drop_off_location: yup.string().required('Delivery Location is required'),
 sub_total:yup.string().required('Sub Total is required'),
   extra_total:yup.string().required('Extra Total is required'),
   total_charge:yup.string().required('Total Charges is required')
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
    const multipleImageUploder = async (image: any) => {
        setMultipleImage(image)
        setError('image', { message: '' })
    }

    // const paymentMethodChange = (e: any) => {
    //     const { value } = e.target;
    //     setValue("payment_method", value)
    //     setPaymentMethodSelect(value)

    // }

    // const paymentStatusChange = (e: any) => {
    //     const { value } = e.target;
    //     setValue("payment_status", value)
    //     setPaymentStatusSelect(value)

    // }

    const orderStatusChange = (e: any) => {
        const { value } = e.target;
        setOrderSelect(value);

    }
    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value)


    }


    const imageUploder = async (file: any) => {
        if (file.size <= 1000000) {
            setImagefile(file)
            setImagePreview(null)
            setValue('image', file)
            setError('image', { message: '' })
            const formData = new FormData();
            formData.append("image", file);
            try {
                setLoading(true)
                const response = await postData('admin/product/uploadimage', formData)
                setValue('image', response?.data?.data)
                setError('image', { message: '' })
            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        } else {
            setImagePreview(null)
            setImagefile(null)
            toast.warning('Image should be less than or equal 1MB')
        }


    }

    const getVenderListShow = async () => {

        try {
            setLoader(true)
            const response = await fetchData(`admin/pickup-drop/${idd}`)
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

    // const ChangeOrderStatus = async () => {

    //     let value = {
    //         order_id: idd,
    //         status: orderSelect,
    //         comments: getValues('comment')
    //     }
    //     try {
    //         setLoading(true)
    //         await postData('admin/order/status', value)
    //         toast.success('Order Updated Successfully')
    //         router.push('/shipments')
    //         setLoading(false)
    //     } catch (err: any) {
    //         toast.error(err?.message)
    //         setLoader(false)
    //     } finally {
    //         setLoading(false)
    //     }

    // }

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


    // const GetPlatformCharge = async () => {
    //     try {

    //         const response = await fetchData('common/platformcharge')
    //         setplatformList(response?.data?.data)

    //     } catch (err) {

    //     }
    // }



    useEffect(() => {
        vendorStatus();
        // GetPlatformCharge()
    }, [])





    useEffect(() => {
        if (orderviewList) {
            setValue('item_name', orderviewList?.user?.item_name)
            setValue('description', orderviewList?.user?.description)
            setValue('weight', orderviewList?.user?.weight)
            setValue('vehicle_type', orderviewList?.vehicle_type)
            setValue('pickup_date', orderviewList?.pickup_date)
            setValue("pickup_time", orderviewList.pickup_time);
            setValue("pickup_location", orderviewList?.pickup_location);
            setValue("drop_off_location", orderviewList?.drop_off_location);
            setValue("image", orderviewList?.image);
           
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
        console.log(data);


        let result = {
          
            
           
            ...data,
           
        }
        console.log(result);
        
        try {

            await postData('admin/pickup-drop/create',data);
            // router.push('/shipments')
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
                             error={errors.customer_name}
                            fieldName="Customer Name"
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
                            fieldName="Email Address"
                            placeholder={``}
                            fieldLabel={"Emial Address"}
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
                            fieldName="Mobile Number"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName="Customer Group"
                            placeholder={``}
                            fieldLabel={"Customer group"}
                            disabled={false}
                            view={false}
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
                            fieldLabel={" PickUp Item Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={7}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Description"}
                            disabled={false}
                            view={false}
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
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={4.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vehicle_type}
                            fieldName="vehicle_type"
                            disabled={view ? true : false}
                            placeholder={``}
                            fieldLabel={"Vehicle Type Needed"}
                           view={false}
 
                       defaultValue={''}/>
                        
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                    <CustomDatePicker
                                values={''}
                                changeValue={() => null}
                                fieldName='pickup_date'
                                control={control}
                                error={errors.pickup_date}
                                fieldLabel={'Expiry Time'}
                            />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                    <CustomTimepicker
                            changeValue={() => null}
                            fieldName='pickup_time'
                            control={control}
                            error={errors.pickup_time}
                            fieldLabel={'Expiry Time(Hrs)'} />
                        
                    
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
                    <Grid item xs={12} lg={4.7}>
                        <CustomTextarea
                        // type='text'
                            control={control}
                            error={errors.pickup_location}
                            fieldName="pickup_location"
                            placeholder={``}
                            fieldLabel={"pickup_location"}
                            disabled={false}
                            view={idd ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={4.7}>
                        <CustomTextarea
                            control={control}
                            // type='text'
                            error={errors.drop_off_location}
                            fieldName="drop_off_location"
                            placeholder={``}
                            fieldLabel={"Delivery Location"}
                            disabled={false}
                            view={idd ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
                {/* {view &&
                        <Grid item xs={12} lg={3}>
                            {/* <Avatar variant='square' src={`${IMAGE_URL}${productList?.product_image}`} sx={{ width: '100%', height: 130 }} /> */}
                        {/* </Grid> */}
                    {/* {!view &&
                        <Grid item xs={12} lg={3}>
                            <CustomImageUploader
                                ICON={""}
                                viewImage={imagePreview}
                                error={errors.image}
                                fieldName="image"
                                placeholder={``}
                                fieldLabel={"Product Image"}
                                control={control}
                                height={130}
                                max={5}
                                onChangeValue={imageUploder}
                                preview={imagefile}
                                previewEditimage={""}
                                type={"file"}
                                background="#e7f5f7"
                                myid="contained-button-file"
                                width={"100%"}
                            />

                        </Grid>}
             */}
            
                <Grid container spacing={2}>
               
                    <Grid item xs={12} lg={6}>

{/* this only in edit image code ************************************** */}
<div style={{marginTop:"15px"}}/>
{defaultImage.length > 0 && !view &&
    <>
        {/* <Box display={'flex'} gap={2} >
            {defaultImage && defaultImage?.map((res: any, i: number) => (
                // <Box position={'relative'}>
                //     <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 100, height: 100, }} />
                //     <Box position={'absolute'} top={0} right={0}><HighlightOffIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => removeImage(res)} /></Box>
                // </Box>

            ))}
        </Box> */}
    </>
}

{view &&
    <>
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
        >{'Additional Images'}

        </Typography>
        <Box display={'flex'} gap={2}   >

            {defaultImage && defaultImage?.map((res: any, i: number) => (
                <Box>
                    <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 130, height: 130, }} />
                </Box>
            ))}
        </Box>
    </>
}

{!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='' />}
</Grid>


                
                    {/* <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.sub_total}
                            fieldName="sub_total"
                            placeholder={``}
                            fieldLabel={"Sub Total"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.extra_total}
                            fieldName="extra_total"
                            placeholder={``}
                            fieldLabel={"Extra Total"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                    <CustomInput
                                type='text'
                                control={control}
                                error={errors.total_charge}
                                fieldName="total_charge"
                                placeholder={``}
                                fieldLabel={"Total Charges"}
                                disabled={false}
                                view={view ? true : false}
                                defaultValue={''}
                            />
                    </Grid> */}
                </Grid>
            </CustomBox>
            {/* <CustomBox title='Product Details'>
                {orderviewList &&
                    // <ShippingTable res={orderviewList} readonly={res} id={idd} SetDeliveryCharge={SetDeliveryCharge} />}
            </CustomBox> */}

           
                       
            {/* {idd && <HistoryTable res={orderviewList?.order_history} />} */}
            <Grid container lg={12} spacing={0.5} display={'flex'} direction={"row"} >
  <CustomBox title='Rider'>
    <Grid item xs={12} lg={12} >
   
       <Customselect
              type='text'
              control={control}
              error={errors.assign_rider}
              fieldName="Assign Rider"
              placeholder={``}
              fieldLabel={"Assign Rider"}
              selectvalue={""}
              height={40}
              label={''}
              size={20}
              value={type}
              options={''}
              onChangeValue={onChangeSelect}
              background={'#fff'}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Customselect>
    </Grid>
  </CustomBox>

  {/* Add spacing between CustomBox components */}
  <div style={{ marginLeft: "20px" }} />

  <CustomBox title='Status'>
    <Grid item xs={12} lg={12} >
    <Customselect
              type='text'
              control={control}
              error={errors.assign_rider}
              fieldName="Choose Status"
              placeholder={``}
              fieldLabel={"Choose Status"}
              selectvalue={""}
              height={40}
              label={''}
              size={20}
              value={type}
              options={''}
              onChangeValue={onChangeSelect}
              background={'#fff'}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Customselect>
    </Grid>
  </CustomBox>
</Grid>

       
              
            {<Box py={3} display={'flex-container'} justifyContent={'center'}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Add details'}
                    disabled={loading}
                    onClick={handleSubmit(SubmitOrder)} />
            </Box>}
        </Box>
    )
}

export default PickUp