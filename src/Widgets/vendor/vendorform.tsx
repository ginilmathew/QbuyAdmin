import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem, Avatar } from '@mui/material'
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
import CustomLoader from '@/components/CustomLoader';



type Inputs = {
    vendor_name: any,
    vendor_email: any,
    vendor_mobile: any,
    store_name: any,
    store_address: any,
    franchise_id: any,
    category_id: any,
    start_time: any,
    end_time: any,
    store_logo: any,
    coordinates: any,
    license_number: any,
    ffsai_number: any,
    pan_card_number: any,
    aadhar_card_number: any,
    account_number: any,
    ifsc: any,
    branch: any,
    recipient_name: any,
    commission: any,
    offer_description: any,
    tax: any,
    type: any,
    display_order: any,
    latitude:any,
    longitude:any
};


type IFormInput = {
    vendor_name: any,
    vendor_email: any,
    vendor_mobile: any,
    store_name: any,
    store_address: any,
    franchise_id: any,
    category_id: any,
    start_time: any,
    end_time: any,
    store_logo: any,
    license_number: any,
    ffsai_number: any,
    pan_card_number: any,
    aadhar_card_number: any,
    account_number: any,
    ifsc: any,
    branch: any,
    recipient_name: any,
    commission: any,
    offer_description: any,
    tax: any,
    coordinates: any,
    type: string,
    display_order: any,
    latitude:any,
    longitude:any
};

type props = {
    res?: any
    view?: any,
    data?: any
}

const Vendorform = ({ res, view, data }: props) => {
    const idd = res ? res : view;

    console.log({ data })

    const router = useRouter();




    const [imagefile, setImagefile] = useState<null | File>(null)
    const [category, setCategory] = useState<string>('')
    const [franchise, setFranchise] = useState<string>('')
    const [getfranchise, setGetFranchise] = useState<any>([])
    const [getcategory, setGetCategory] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [postArray, setPostArray] = React.useState<any>([]);
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [paths, setPaths] = useState<any>(null)
    const [vendorList, setVendorList] = useState<any>(data)





    const orderValidation = /^[0-9]*$/

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const commissionvalidation = /^\d*\.?\d*$/
    const schema = yup
        .object()
        .shape({
            vendor_name: yup.string().max(30, "Name must be less than 30 characters").matches(
                /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
                'Name can only contain alphabets letters.'
            )
                // .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.')
                .required('Name is Required'),
            vendor_email: yup.string().max(30, 'Maximum Character Exceeds').email("Email must be a valid email").required('Email is Required'),
            vendor_mobile: yup.string().required('Mobile Number is  Required').min(10, 'Minimum 10 digits').max(10, 'Mobile number is not valid').matches(phoneRegExp, 'Mobile number is not valid'),
            store_name: yup.string().max(60, 'Maximum Character Exceeds').required('Store Name is Required'),
            // store_address: yup.string().required('Store Address is Required'),
            franchise_id: yup.string().required('Franchise is  Required'),
            category_id: yup.array().typeError('Category is Required').required('Category is Required'),
            // start_time: yup.string().required('Required'),
            // end_time: yup.string().required('Required'),
            store_logo: yup
                .mixed()
                .typeError("Store Logo is Required")
                .required("Store Logo is Required"),
            coordinates: yup.array().required("Delivery Location Required").typeError("Delivery Location Required"),
            commission: yup.number().required('Commission is required')
                .nullable('Commission is Required').typeError('Commission is required')
                .notRequired()
                .min(0)
                .max(100, "Commission have maximum 100%")
                .test(
                    "noEOrSign", // type of the validator (should be unique)
                    "Commission is Required", // error message
                    (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
                ),
            display_order: yup.string().matches(orderValidation, 'Accept only positive number').nullable()

        })



    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                vendor_name: null,
                vendor_email: null,
                vendor_mobile: null,
                store_name: null,
                store_address: null,
                store_logo: null,
                franchise_id: null,
                category_id: null,
                start_time: null,
                end_time: null,
                license_number: null,
                ffsai_number: null,
                pan_card_number: null,
                aadhar_card_number: null,
                account_number: null,
                ifsc: null,
                branch: null,
                recipient_name: null,
                commission: null,
                offer_description: null,
                tax: null,
                coordinates: null,
                display_order: null,
            }
        });







    const getVendorlist = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/vendor/show/${idd}`)
            setVendorList(response?.data?.data)

        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }


    // useEffect(() => {
    //     if (idd) {
    //         getVendorlist()
    //     }
    // }, [idd])



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
        if (file.size <= 1000000) {
            setImagefile(file)
            setImagePreview(null)
            setValue('store_logo', file)
            setError('store_logo', { message: '' })
        } else {
            setImagefile(null)
            setImagePreview(null)
            toast.warning('Image should be less than or equal 1MB')
        }

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
            setGetFranchise(response?.data?.data)
            //reset()
            //setCategory('')
            //setFranchise('')
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
            const response = await fetchData(`/admin/category/list/${process.env.NEXT_PUBLIC_TYPE}`)
            console.log({ response })
            setGetCategory(response?.data?.data)
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

        let array = vendorList?.category_id?.map((res: any) => res?.id)
        if (vendorList && array) {
            setValue('vendor_name', vendorList?.vendor_name)
            setValue('vendor_mobile', vendorList?.vendor_mobile)
            setValue('vendor_email', vendorList?.vendor_email)
            setValue('store_name', vendorList?.store_name)
            setValue('store_address', vendorList?.store_address)
            setValue('franchise_id', vendorList?.franchise_id)
            setFranchise(vendorList?.franchise_id)
            setValue('category_id', vendorList?.category_id)
            setCategory(vendorList?.category_id)
            setValue('store_logo', vendorList?.store_logo)
            setImagePreview(`${IMAGE_URL}${vendorList?.store_logo}`)
            setValue('start_time', vendorList?.start_time ? moment(vendorList?.start_time, 'HH:mm') : null)
            setValue('end_time', vendorList?.end_time ? moment(vendorList?.end_time, 'HH:mm') : null)
            setValue('license_number', vendorList?.kyc_details?.license_number)
            setValue('ffsai_number', vendorList?.kyc_details?.ffsai_number)
            setValue('pan_card_number', vendorList?.kyc_details?.pan_card_number)
            setValue('aadhar_card_number', vendorList?.kyc_details?.aadhar_card_number)
            setValue('account_number', vendorList?.kyc_details?.account_number)
            setValue('ifsc', vendorList?.kyc_details?.ifsc)
            setValue('branch', vendorList?.kyc_details?.branch)
            setValue('recipient_name', vendorList?.kyc_details?.recipient_name)
            setValue('commission', vendorList?.additional_details?.commission)
            setValue('offer_description', vendorList?.additional_details?.offer_description)
            setValue('tax', vendorList?.additional_details?.tax)
            setMultipleArray(array)
            setValue('display_order', vendorList?.display_order)
            let paths = vendorList?.delivery_location?.map((loc: any) => {
                return {
                    lat: parseFloat(loc[0]),
                    lng: parseFloat(loc[1])
                }
            })
            setPaths(paths)
            setValue('coordinates', vendorList?.delivery_location)
        }
    }, [vendorList])



    const onChangeStartTime = (value: any) => {
        console.log({ value })
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
        let find = getcategory?.filter((res: any, I: number) => event.target.value.includes(res._id))
        let data = find?.map((res: any) => ({
            id: res?._id,
            name: res?.name,
            image: res?.image

        }))

        if (data) {
            setValue('category_id', data)
            setError('category_id', { message: '' })
        }

        setPostArray(data)
        setMultipleArray(
            values
        );

    }



    const onSubmit: SubmitHandler<IFormInput> = async (data) => {

        console.log({ data })

        const URL_CREATE = '/admin/vendor/create'
        const URL_EDIT = '/admin/vendor/update'
        let kyc_details = {
            license_number: data?.license_number ? data?.license_number : null,
            ffsai_number: data?.ffsai_number ? data?.ffsai_number : null,
            pan_card_number: data?.pan_card_number ? data?.pan_card_number : null,
            aadhar_card_number: data?.pan_card_number ? data?.pan_card_number : null,
            account_number: data?.account_number ? data?.account_number : null,
            branch: data?.branch ? data?.branch : null,
            recipient_name: data?.recipient_name ? data?.recipient_name : null,
            ifsc: data?.ifsc ? data?.ifsc : null
        }

        let additional_details = {
            commission: data?.commission ? data?.commission : null,
            offer_description: data?.offer_description ? data?.offer_description : null,
            tax: data?.tax ? data?.tax : null
        }

        setLoading(true)
        const formData = new FormData();
        const type: any = process.env.NEXT_PUBLIC_TYPE;
        formData.append("vendor_name", data?.vendor_name);
        formData.append("vendor_email", data?.vendor_email);
        formData.append("vendor_mobile", data?.vendor_mobile);
        formData.append("store_name", data?.store_name);
        formData.append("store_address", data?.store_address);
        formData.append("franchise_id", data?.franchise_id);
        formData.append("category_id", JSON.stringify(data?.category_id));
        formData.append("start_time", data?.start_time ? moment(data?.start_time, 'hh:mm A').format('HH:mm') : "null");
        formData.append("end_time", data?.end_time ? moment(data?.end_time, 'hh:mm A').format('HH:mm') : "null");
        formData.append("store_logo", data?.store_logo);
        formData.append("display_order", data?.display_order);
        formData.append("type", type);
        if (idd) {
            formData.append("id", vendorList?._id);
        }
        // formData.append("license_number", data?.license_number);
        // formData.append("ffsai_number", data?.ffsai_number);
        // formData.append("pan_card_number", data?.pan_card_number);
        // formData.append("aadhar_card_number", data?.aadhar_card_number);
        // formData.append("account_number", data?.account_number);
        // formData.append("ifsc", data?.ifsc);
        // formData.append("branch", data?.branch);
        // formData.append("recipient_name", data?.recipient_name);
        formData.append('kyc_details', JSON.stringify((kyc_details)));
        formData.append('additional_details', JSON.stringify((additional_details)));
        // formData.append("commission", data?.commission);
        // formData.append("offer_description", data?.offer_description);
        // formData.append("tax", data?.tax);
        formData.append("coordinates", JSON.stringify(data?.coordinates));
        try {
            await postData(vendorList ? URL_EDIT : URL_CREATE, formData)
            toast.success(vendorList ? 'Updated Successfully' : 'Created Successfully')

            router.push('/vendor')
            reset()
            setVendorList(null)
            setFranchise('')
            setCategory('')
            setMultipleArray([])
            setImagefile(null)
            setImagePreview(null)
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



    useEffect(() => {
        getFranchiseList();
        getCategoryList();
    }, [])

    if (loader) {
        return <><CustomLoader /></>
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
                            view={view ? true : false}
                            defaultValue={vendorList?.vendor_name}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.display_order}
                            fieldName="display_order"
                            placeholder={``}
                            fieldLabel={"Display Order"}
                            disabled={false}
                            view={view ? true : false}

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
                                view={view ? true : false}

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
                                view={view ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3.5}>
                            <Customselect
                                disabled={view ? true : false}
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
                                {getfranchise && getfranchise?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
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
                                readOnly={view ? true : false}
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
                                disabled={view ? true : false}
                                changeValue={onChangeStartTime}
                                fieldName='start_time'
                                control={control}
                                error={errors.start_time}
                                fieldLabel={'Store Time'} />
                        </Grid>
                        <Grid item xs={12} lg={2.1}>
                            <Typography mb={3}></Typography>
                            <CustomTimepicker
                                disabled={view ? true : false}
                                changeValue={onChangeEndTime}
                                fieldName='end_time'
                                control={control}
                                error={errors.end_time}
                                fieldLabel={''} />
                        </Grid>
                    </Grid>
                    {!view &&
                        <Box flex={.3} sx={{}}>
                            <CustomImageUploader
                                ICON={""}
                                viewImage={imagePreview}
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
                        </Box>}

                    {view &&
                        <Box flex={.2} sx={{}}>
                            <Typography>Store Logo/Image</Typography>
                            <Avatar variant='square' src={`${IMAGE_URL}${vendorList?.store_logo}`} sx={{ width: '100%', height: 130 }} />
                        </Box>}

                </Box>
                <Box py={2}>
                    <Divider />
                    {/* {isLoaded && */}
                    <Box py={1}>
                        {idd && data?.delivery_location ? <Polygon onComplete={polygonComplete} path={paths} /> : <Maps onPolygonComplete={polygonComplete} />}
                        {(errors && errors?.coordinates) && <span style={{ color: 'red', fontSize: 12 }}>{`${errors?.coordinates?.message}`}</span>}
                    </Box>
                </Box>
            </CustomBox>
            <CustomBox title='Location'>
            <Grid container spacing={2}>
            <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.latitude}
                            fieldName="latitude"
                            placeholder={``}
                            fieldLabel={"Latitude"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.longitude}
                            fieldName="longitude"
                            placeholder={``}
                            fieldLabel={"Longitude"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
            </Grid>
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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

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
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={7.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.offer_description}
                            fieldName="offer_description"
                            placeholder={``}
                            fieldLabel={"Offer Description"}
                            disabled={false}
                            view={view ? true : false}

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
                            view={view ? true : false}

                        />
                    </Grid>

                </Grid>
            </CustomBox>
            {!view &&
                <Box py={3}>
                    <Custombutton
                        btncolor=''
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={res ? 'Update' : 'Add Vendor'}
                        disabled={loading}
                        onClick={handleSubmit(onSubmit)} />
                </Box>}
        </Box>
    )
}

export default Vendorform