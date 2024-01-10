
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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


import { useRouter } from 'next/router';

import CustomTextarea from '@/components/CustomTextarea';
import CustomLoader from '@/components/CustomLoader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import CustomDatePicker from '@/components/CustomDatePicker';
import { CustomMultipleImageUploader } from '@/components/CustomMultipleImageUploder';
import { IMAGE_URL } from '@/Config';
import RenderResult from 'next/dist/server/render-result';
import moment from 'moment';
// import ShippingTable from './shippingViewTable';
// import HistoryTable from './shippingViewTable/History';


type Inputs = {
    customer_name: string,
    email: string,
    mobile: number,
    assign_rider: string,
    customer_group: string,
    item_name: string,
    description: string,
    weight: number,
    vehicle_type: string,
    pickup_date: Date,
    pickup_time: Date,
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
    const [PickUpand, setPickUpand] = useState<string[]>([])
    const [description, setdescription] = useState<string>('')
    const [weight, setweight] = useState<any>([])
    const [pickup_location, setpickup_location] = useState<string>('')
    const [drop_off_location, setdrop_off_location] = useState<any>([])
    const [item_name, setitem_name] = useState<string>('')
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

            weight: yup
                .number()
                .typeError('Weight must be a number')
                .required('Weight is required'),
            vehicle_type: yup.string().required('Vehicle Type is required'),
            //    pickup_date:yup.date().required("Pickup Date required"),
            // pickup_time: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm:aa)').required('Pickup Time is required'),
            pickup_location: yup.string().required('Pickup Location is required'),
            drop_off_location: yup.string().required('Delivery Location is required'),
            //  sub_total:yup.string().required('Sub Total is required'),
            //    extra_total:yup.string().required('Extra Total is required'),
            //    total_charge:yup.string().required('Total Charges is required')
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
        console.log({ multipleImage });

    }


    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value)


    }
    console.log(view);


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
            const response = await fetchData(`admin/pickup-drop/show/${idd}`)
            setOrderViewList(response?.data?.data)

            setLoader(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)

        } finally {
            setLoader(false)
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



    const fetchDefaultImages = async () => {
        try {
            // Replace this with your logic to fetch image URLs based on the ID
            const response = await fetchData(`admin/pickup-drop/images/${idd}`);
            return response?.data?.data || [];
        } catch (error) {
            console.error('Error fetching default images:', error);
            return [];
        }
    };





    useEffect(() => {
        if (orderviewList) {
            console.log(orderviewList);
            const formattedPickupDate = new Date(orderviewList.pickup_date);
            setValue('pickup_date', formattedPickupDate);
            setValue('item_name', orderviewList?.item_name)
            setitem_name(orderviewList?.item_name)
            setValue('description', orderviewList?.description)
            setdescription(orderviewList?.description)
            setValue('weight', orderviewList?.weight)
            setweight(orderviewList?.weight)
            setValue('vehicle_type', orderviewList?.vehicle_type)
            setValue('pickup_date', formattedPickupDate);
            // setValue('pickup_time', formattedPickupTime);
            setValue("pickup_location", orderviewList?.pickup_location);
            setpickup_location(orderviewList?.pickup_location)
            setValue("drop_off_location", orderviewList?.drop_off_location);
            setdrop_off_location(orderviewList?.drop_off_location)
            setValue("image", orderviewList?.image);
            if (edit) {
                // Replace 'fetchDefaultImages' with your actual function to fetch image URLs
                fetchDefaultImages().then((images) => {
                    setdefaultImage(images);
                });
            }

        }

    }, [orderviewList])




    useEffect(() => {
        if (idd) {
            getVenderListShow()
        }
    }, [idd])




    const SubmitOrder = async (data: any) => {
        const formData = new FormData();
        if (orderviewList) {
            formData.append('id', orderviewList?._id)
            formData.append('description', description);
            formData.append('status', orderviewList?.status)
            //  formData.append('pickup_date', result?.pickup_date)
            // formData.append('pickup_time', result?.pickup_time)
            // formData.append('vehicle_type', result?.vehicle_type)
            formData.append('weight', weight)
            formData.append('pickup_location', pickup_location)
            formData.append("drop_off_location", drop_off_location)
            formData.append('item_name', item_name)
            // formData.append('customer_name',result?.customer_name)
            // formData.append('email',result?.email)
            // formData.append('mobile',result?.mobile)
            // formData.append('customer_group',result?.customer_group)

            console.log({ formData });

            try {

                await postData('admin/pickup-drop/update', formData)


                // router.push('/shipments')
                toast.success('Order Updated Successfully')
                setValue("description", "")

            } catch (err) {
                let message = 'Unknown Error'
                if (err instanceof Error) message = err.message
                reportError({ message })
                toast.error(message)
            }




        } else {

            if (multipleImage?.length > 0) {


                multipleImage?.map((img: any, i: number) => {
                    formData.append(`image[${i}]`, img.file);
                })



                let result = {



                    ...data,
                }
                console.log({ result });

                formData.append('description', result?.description);
                formData.append('pickup_date', result?.pickup_date)
                formData.append('pickup_time', result?.pickup_time)
                formData.append('vehicle_type', result?.vehicle_type)
                formData.append('weight', result?.weight)
                formData.append('pickup_location', result?.pickup_location)
                formData.append("drop_off_location", result?.drop_off_location)
                formData.append('item_name', result?.item_name)
                formData.append('customer_name', result?.customer_name)
                formData.append('email', result?.email)
                formData.append('mobile', result?.mobile)
                formData.append('customer_group', result?.customer_group)

                console.log({ formData });

                try {

                    await postData('admin/pickup-drop/create', formData)


                    // router.push('/shipments')
                    toast.success('Order Updated Successfully')
                    setValue("description", "")

                } catch (err) {
                    let message = 'Unknown Error'
                    if (err instanceof Error) message = err.message
                    reportError({ message })
                    toast.error(message)
                }
            }
        }

    }
    if (loader) {
        return <><CustomLoader /></>
    }
    const pickupDate = (e: any) => {
        setValue('pickup_date', e)

    }
    const pickupTime = (e: any) => {
        setValue('pickup_time', e)
    }
    console.log(defaultImage);
    const removeImage = (name: string) => {
        const result = defaultImage?.filter((res: any) => res !== name)
        setdefaultImage([...result])

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
                            fieldName="customer_name"
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={view ? true : false}
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
                            fieldName="mobile"
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
                            fieldName="customer_group"
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
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            view={view ? true : false}

                            defaultValue={''} />

                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomDatePicker
                            values={''}
                            disabled={view ? true : false}
                            changeValue={(e) => pickupDate}
                            fieldName='pickup_date'
                            control={control}
                            error={errors.pickup_date}
                            fieldLabel={'Pickup Date'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomTimepicker
                            changeValue={() => pickupTime}
                            fieldName='pickup_time'
                            control={control}
                            disabled={view ? true : false}
                            error={errors.pickup_time}
                            fieldLabel={'Pickup Time'} />


                    </Grid>

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
                    <Grid item xs={12} lg={6}>

                        {/* this only in edit image code ************************************** */}

                        {defaultImage.length > 0 && !view &&
                            <>
                                <Box display={'flex'} gap={2} style={{ height: '200px', overflow: 'auto' }} >
                                    {defaultImage && defaultImage?.map((res: any, i: number) => (
                                        <Box position={'relative'}>
                                            <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 100, height: 100, }} />
                                            <Box position={'absolute'} top={0} right={0}><HighlightOffIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => removeImage(res)} /></Box>
                                        </Box>

                                    ))}
                                </Box>
                            </>
                        }


                        {view &&
                            <div style={{ height: '200px', overflow: 'auto' }}>
                                <>
                                    <Typography letterSpacing={0.5} px={3} mb={3}
                                        sx={{
                                            fontSize: {
                                                lg: 16,
                                                md: 14,
                                                sm: 12,
                                                xs: 11,
                                            },
                                            fontFamily: `'Poppins' sans-serif`,
                                        }}
                                    >{'Additional Images'}</Typography>
                                    <Box display="flex" gap={2}>
                                        {defaultImage && defaultImage.map((res: any, i: number) => (
                                            <Box key={i}>
                                                <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 130, height: 130 }} />
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            </div>
                        }

                        {/* {!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />} */}
                        <div style={{ height: '200px', overflow: 'auto' }}>
                            {!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />}
                        </div>

                    </Grid>
                </Grid>
            </CustomBox>

            <CustomBox title='Other Details'>
                <Grid container spacing={2}>
                <Grid item xs={12} lg={3} >

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
                    ><MenuItem value="" disabled >
                            <>Select Rider</>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Customselect>
                </Grid>
                <Grid item xs={12} lg={3} >

                    <Customselect
                        type='text'
                        control={control}
                        error={errors.assign_rider}
                        fieldName="Assign Rider"
                        placeholder={``}
                        fieldLabel={"Status"}
                        selectvalue={""}
                        height={40}
                        label={''}
                        size={20}
                        value={type}
                        options={''}
                        onChangeValue={onChangeSelect}
                        background={'#fff'}
                    ><MenuItem value="" disabled >
                            <>Select Rider</>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Customselect>
                </Grid>
                </Grid>
            </CustomBox>

            {<Box py={3} display={'flex-container'} justifyContent={'center'}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={40}
                    label={edit ? 'update' : 'Add details'}
                    disabled={loading}
                    onClick={handleSubmit(SubmitOrder)} />
            </Box>}
        </Box>
    )
}

export default PickUp