import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler, set } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import CustomImageUploader from '@/components/CustomImageUploader';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import { GoogleMap, Polygon, useJsApiLoader, LoadScript, Marker, DrawingManager } from "@react-google-maps/api";
import { fetchData } from '@/CustomAxios';
import CustomTimepicker from '@/components/CustomTimepicker';
import dayjs, { Dayjs } from 'dayjs';
import { postData } from '@/CustomAxios';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import moment from 'moment'
import CustomMultiselect from '@/components/CustomMultiselect';
import Maps from '@/components/maps/maps';




type Inputs = {
    vendor_name: string,
    vendor_email: string,
    vendor_mobile: string,
    store_name: string,
    store_address: string,
    franchise_id: string,
    category_id: any,
    start_time: any,
    end_time: any,
    store_logo: any,
    coordinates: any,
    license_number: string,
    ffsai_number: string,
    pan_card_number: string,
    aadhar_card_number: string,
    account_number: string,
    ifsc: string,
    branch: string,
    recipient_name: string,
    commission: string,
    offer_description: string,
    tax: string,
};


type IFormInput = {
    vendor_name: string,
    vendor_email: string,
    vendor_mobile: string,
    store_name: string,
    store_address: string,
    franchise_id: string,
    category_id: any,
    start_time: any,
    end_time: any,
    store_logo: any,
    license_number: string,
    ffsai_number: string,
    pan_card_number: string,
    aadhar_card_number: string,
    account_number: string,
    ifsc: string,
    branch: string,
    recipient_name: string,
    commission: string,
    offer_description: string,
    tax: string,
    coordinates: any
};

const Vendorform = () => {

    const [imagefile, setImagefile] = useState<null | File>(null)
    const [category, setCategory] = useState<string>('')
    const [franchise, setFranchise] = useState<string>('')
    const [getfranchise, setGetFranchise] = useState<any>([])
    const [getcategory, setGetCategory] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [postArray, setPostArray] = React.useState<any>([]);


    console.log({ postArray })

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const schema = yup
        .object()
        .shape({
            vendor_name: yup.string().required('Vendor Name is Required'),
            vendor_email: yup.string().email("Email must be a valid email").required('Email is Required'),
            vendor_mobile: yup.string().min(10, 'Phone number is not valid').matches(phoneRegExp, 'Phone number is not valid').required('Mobile Number is  Required'),
            store_name: yup.string().required('Store Name is Required'),
            // store_address: yup.string().required('Store Address is Required'),
            franchise_id: yup.string().required('Franchise is  Required'),
            category_id: yup.array().typeError('Category is Required').required('Category is Required'),
            // start_time: yup.string().required('Required'),
            // end_time: yup.string().required('Required'),
            // store_logo: yup.string().required('Logo is Required'),
            // // coordinates: any,
            // license_number: yup.string().required('License Number is Required'),
            // ffsai_number: yup.string().required('FFASI Number is Required'),
            // pan_card_number: yup.string().required('PAN card Number is Required'),
            // aadhar_card_number: yup.string().required('Adhar card Number is Required'),
            // account_number: yup.string().required('Account Number is Required'),
            // ifsc: yup.string().required('IFSC is Required'),
            // branch: yup.string().required('Branch is Required'),
            // recipient_name: yup.string().required('Recipient Name is Required'),
            coordinates: yup.array().required("Delivery Location Required").typeError("Delivery Location Required")

        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                vendor_name: '',
                vendor_email: '',
                vendor_mobile: '',
                store_name: '',
                store_address: '',
                franchise_id: '',
                category_id: '',
                start_time: '',
                end_time: '',
                store_logo: '',
                license_number: '',
                ffsai_number: '',
                pan_card_number: '',
                aadhar_card_number: '',
                account_number: '',
                ifsc: '',
                branch: '',
                recipient_name: '',
                commission: '',
                offer_description: '',
                tax: '',
                coordinates: null
            }
        });







    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I",
        id: 'google-map-script',
    })





    const containerStyle = {
        width: "100%",
        height: "400px",
    };

    const center = {
        lat: 37.7749,
        lng: -122.4194,
    };



    const [path, setPath] = useState([
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
    ]);

    // Define refs for Polygon instance and listeners
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

    // Call setPath with new edited path
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng: google.maps.LatLng) => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
        }
    }, [setPath]);

    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
        (polygon: google.maps.Polygon) => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );

    // Clean up refs
    const onUnmount = useCallback(() => {
        listenersRef.current.forEach((lis: google.maps.MapsEventListener) => lis.remove());
        polygonRef.current = null;
    }, []);


    const imageUploder = (file: any) => {
        setImagefile(file)
        setValue('store_logo', file)
        setError('store_logo', { message: '' })

    }


    const onChangeSelectCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(e.target.value)
        setValue('category_id', e.target.value)
        setError('category_id', { message: '' })

    }

    const onChangeSelectFranchise = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFranchise(e.target.value)
        setValue('franchise_id', e.target.value)
        setError('franchise_id', { message: '' })


    }

    const getFranchiseList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/franchise/list')
            setGetFranchise(response?.data?.data?.data)
            reset()
            setCategory('')
            setFranchise('')
            setImagefile(null)
            setLoading(false)

        } catch (err: any) {
            toast.error(err)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }

    }


    const getCategoryList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/category/list')
            setGetCategory(response?.data?.data?.data)
            setLoading(false)

        } catch (err: any) {
            toast.error(err)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }

    }


    useEffect(() => {
        getFranchiseList();
        getCategoryList();
    }, [])


    const onChangeStartTime = (value: any) => {
        setValue('start_time', value)
        setError('start_time', { message: '' })

    }

    const onChangeEndTime = (value: any) => {
        setValue('end_time', value)
        setError('end_time', { message: '' })
    }




    const onChangeMultiple = (event: any) => {
        const {
            target: { value },
        } = event;

        const values = event.target.value
        let find = getcategory?.filter((res:any, I:number) => event.target.value.includes(res._id))
        let data = find?.map((res:any) => ({
          id: res?._id,
          name: res?.name
    
        }))
        if(data){
            setValue('category_id',data)
            setError('category_id', { message: '' })
          }
         
        setPostArray(data)
        setMultipleArray(
            values
        );

    }



    const onSubmit: SubmitHandler<IFormInput> = async (data) => {

        setLoading(true)
        const formData = new FormData();
        formData.append("vendor_name", data?.vendor_name);
        formData.append("vendor_email", data?.vendor_email);
        formData.append("vendor_mobile", data?.vendor_mobile);
        formData.append("store_name", data?.store_name);
        formData.append("store_address", data?.store_address);
        formData.append("franchise_id", data?.franchise_id);
        formData.append("category_id", JSON.stringify(data?.category_id));
        formData.append("start_time", moment(data?.start_time, 'hh:mm A').format('hh:mm'));
        formData.append("end_time", moment(data?.end_time, 'hh:mm A').format('hh:mm'));
        formData.append("store_logo", data?.store_logo);
        formData.append("license_number", data?.license_number);
        formData.append("ffsai_number", data?.ffsai_number);
        formData.append("pan_card_number", data?.pan_card_number);
        formData.append("aadhar_card_number", data?.aadhar_card_number);
        formData.append("account_number", data?.account_number);
        formData.append("ifsc", data?.ifsc);
        formData.append("branch", data?.branch);
        formData.append("recipient_name", data?.recipient_name);
        formData.append("commission", data?.commission);
        formData.append("offer_description", data?.offer_description);
        formData.append("tax", data?.tax);
        formData.append("coordinates", JSON.stringify(data?.coordinates));
        try {
            await postData('/admin/vendor/create', formData)
            toast.success('Vendor Created')
            reset()
            setFranchise('')
            setCategory('')
            setMultipleArray([])
            setLoading(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }


    }


    const polygonComplete = (value: any) => {
        setValue("coordinates", value)
    }


    return (
        <Box>
            <CustomBox title='Vendor Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_name}
                            fieldName="vendor_name"
                            placeholder={``}
                            fieldLabel={"Vendor Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_email}
                            fieldName="vendor_email"
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
                            error={errors.vendor_mobile}
                            fieldName="vendor_mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Store Details'>
                <Box display={'flex'}>
                    <Grid container flex={.7} spacing={2}>
                        <Grid item xs={12} lg={3.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.store_name}
                                fieldName="store_name"
                                placeholder={``}
                                fieldLabel={"Store Name"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={7.2}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.store_address}
                                fieldName="store_address"
                                placeholder={``}
                                fieldLabel={"Address"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3.5}>
                            <Customselect
                                type='text'
                                control={control}
                                error={errors.franchise_id}
                                fieldName="franchise_id"
                                placeholder={``}
                                fieldLabel={"Franchise"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={franchise}
                                options={''}
                                onChangeValue={onChangeSelectFranchise}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Franchise</>
                                </MenuItem>
                                {getfranchise && getfranchise?.map((res: any) => (
                                    <MenuItem key={res?._id} value={res?._id}>{res?.franchise_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomMultiselect
                                multiple={true}
                                control={control}
                                error={errors.category_id}
                                fieldName="category_id"
                                placeholder={``}
                                fieldLabel={"Category"}
                                readOnly={false}
                                value={multpleArray}
                                onChangeValue={onChangeMultiple}
                                type=''
                            >
                                <MenuItem value="" disabled >
                                    <>Select Category</>
                                </MenuItem>
                                {getcategory && getcategory.map((res: any) => (
                                    <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                                ))}
                            </CustomMultiselect>
                            {/* <Customselect
                                type='text'
                                control={control}
                                error={errors.category_id}
                                fieldName="category_id"
                                placeholder={``}
                                fieldLabel={"Category"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={category}
                                options={''}
                                onChangeValue={onChangeSelectCategory}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Category</>
                                </MenuItem>
                                {getcategory && getcategory.map((res: any) => (
                                    <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                                ))}
                            </Customselect> */}
                        </Grid>
                        <Grid item xs={12} lg={2.1}>
                            <CustomTimepicker
                                changeValue={onChangeStartTime}
                                fieldName='start_time'
                                control={control}
                                error={errors.start_time}
                                fieldLabel={'Store Time'} />
                        </Grid>
                        <Grid item xs={12} lg={2.1}>
                            <Typography mb={3}></Typography>
                            <CustomTimepicker
                                changeValue={onChangeEndTime}
                                fieldName='end_time'
                                control={control}
                                error={errors.end_time}
                                fieldLabel={''} />
                        </Grid>
                    </Grid>
                    <Box flex={.3} sx={{}}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.store_logo}
                            fieldName="store_logo"
                            placeholder={``}
                            fieldLabel={"Store Logo/Image"}
                            control={control}
                            height={150}
                            max={5}
                            onChangeValue={imageUploder}
                            preview={imagefile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"80%"}
                        />
                    </Box>
                </Box>
                <Box py={2}>
                    <Divider />
                    {/* {isLoaded && */}
                    <Box py={1}>
                        <Maps onPolygonComplete={polygonComplete} />
                        {(errors && errors?.coordinates) && <span style={{ color: 'red', fontSize: 12 }}>{errors?.coordinates?.message}</span>}
                    </Box>
                </Box>
            </CustomBox>
            <CustomBox title='KYC Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.license_number}
                            fieldName="license_number"
                            placeholder={``}
                            fieldLabel={"License Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.ffsai_number}
                            fieldName="ffsai_number"
                            placeholder={``}
                            fieldLabel={"FFSAI Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.pan_card_number}
                            fieldName="pan_card_number"
                            placeholder={``}
                            fieldLabel={"PAN Card Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.aadhar_card_number}
                            fieldName="aadhar_card_number"
                            placeholder={``}
                            fieldLabel={"AADHAR Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
                <Typography fontSize={22} fontWeight={'bold'} py={3}>Bank Account Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.account_number}
                            fieldName="account_number"
                            placeholder={``}
                            fieldLabel={"Account Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.ifsc}
                            fieldName="ifsc"
                            placeholder={``}
                            fieldLabel={"IFSC"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.branch}
                            fieldName="branch"
                            placeholder={``}
                            fieldLabel={"Branch"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.recipient_name}
                            fieldName="recipient_name"
                            placeholder={``}
                            fieldLabel={"Recipient Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                </Grid>

            </CustomBox>
            <CustomBox title='Additional Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.commission}
                            fieldName="commission"
                            placeholder={``}
                            fieldLabel={"Commission (%)"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={7.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.offer_description}
                            fieldName="offer_description"
                            placeholder={``}
                            fieldLabel={"offer Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.tax}
                            fieldName="tax"
                            placeholder={``}
                            fieldLabel={"Tax"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Add Vendor'}
                    disabled={loading}
                    onClick={handleSubmit(onSubmit)} />
            </Box>
        </Box>
    )
}

export default Vendorform