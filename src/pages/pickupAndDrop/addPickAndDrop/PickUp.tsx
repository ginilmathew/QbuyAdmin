
import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../../../Widgets/CustomBox'
import { useForm, SubmitHandler, set } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import { fetchData } from '@/CustomAxios';
import CustomTimepicker from '@/components/CustomTimepicker';
import { postData } from '@/CustomAxios';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { Avatar } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import GoogleAutocomplete from "react-google-autocomplete";
import { useRouter } from 'next/router';
import CustomLoader from '@/components/CustomLoader';
import CustomDatePicker from '@/components/CustomDatePicker';
import { CustomMultipleImageUploader } from '@/components/CustomMultipleImageUploder';
import { IMAGE_URL } from '@/Config';
import moment from 'moment';


// import ShippingTable from './shippingViewTable';
// import HistoryTable from './shippingViewTable/History';


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
    type: any

};

type props = {
    view?: any,
    res?: any,
    edit?: any
}




const PickUp = ({ view, res, edit }: props) => {
    const router = useRouter()

    const idd = view ? view : res;
    const [vechicleList, setVechicleList] = useState<any>([])
    const [vechicleSelect, setVechicleSelect] = useState<any>(null)
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

    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [orderviewList, setOrderViewList] = useState<any>(null)
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


    const orderValidation = /^[0-9]*$/

    const schema = yup
        .object()
        .shape({
            item_name: yup.string().required('Required'),
            name: yup
                .string()
                .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
                .max(40)
                .required('Required'),
            email: yup.string().email().required('Required'),
            description: yup.string().required('Required'),
            grand_total: yup.string().required('Required'),
            mobile: yup.string().matches(orderValidation, 'not valid').max(13).min(10).required('Required'),
            weight: yup
                .number()
                .typeError('Weight must be a number')
                .required('Required'),
            vehicle_type: yup.string().required('Required'),
            pickup_location: yup.string().required('Required'),
            drop_off_location: yup.string().required('Required'),
            payment_status: yup.string().required('Required'),
            payment_type: yup.string().required('Required')

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
                delivery_date: moment(),
                billing_address: ' ',
                shipping_address: ' '
            }

        });



    const multipleImageUploder = async (image: any) => {
        setMultipleImage(image)
        setError('image', { message: '' })


    }






    const getVenderListShow = async () => {


        try {
            setLoader(true)
            const response = await fetchData(`admin/pickup-drop/show/${idd}`)
            let data = response?.data?.data

            const find = vechicleList?.find((res: any) => res?.name === data?.vehicle_type)
         
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
            setValue('vehicle_type', find?._id)
            setValue('grand_total', data?.grand_total)
            setValue('pickup_location', data?.pickup_location)
            setValue('drop_off_location', data?.drop_off_location)
            setVechicleSelect(find?._id)
            setPaymentMethodSelect(data?.payment_type)
            setPaymentStatusSelect(data?.payment_status)
            console.log({ response: response?.data?.data })
            if (data?.image) {
                setImagePreview(data?.image)
            }

            // setOrderViewList(response?.data?.data)

            setLoader(false)

        } catch (err: any) {
            toast.error(err?.message)
            setLoader(false)

        } finally {
            setLoader(false)
        }

    }



    useEffect(() => {
        const getmapList = async () => {
            try {
                setLoading(true)
                const resp = await fetchData('/admin/vehicle-type')
                const response = await fetchData('common/payment-status-list');
                setPaymentStatusList(response?.data?.data)
                setVechicleList(resp?.data?.data)

            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }

        getmapList()
    }, [])





    useEffect(() => {
        if (idd && vechicleList?.length > 0) {
            getVenderListShow()
        }
    }, [idd,vechicleList])






    const handlePlaceSelectedPick = (place: any) => {

        const area = {
            address: place?.formatted_address,
            location: place?.formatted_address,
            latitude: place?.geometry.location.lat(),
            longitude: place?.geometry.location.lng(),

        }

        setKilometer((prevKilometer: any) => ({
            ...prevKilometer,
            pick_lat: area.latitude,
            pick_lng: area.longitude
        }));
        setValue('pickup_location_coordinates', [area.latitude, area.longitude])
        setValue('pickup_location', area.address)
        setValue('shipping_address', area.address)


    };
    const handlePlaceSelectedDrop = (place: any) => {

        const area = {
            address: place?.formatted_address,
            location: place?.formatted_address,
            latitude: place?.geometry.location.lat(),
            longitude: place?.geometry.location.lng(),

        }

        setValue('drop_off_location_coordinates', [area.latitude, area.longitude])
        setValue('drop_off_location', area.address)
        setValue('billing_address', area.address)

        setKilometer((prevKilometer: any) => ({
            ...prevKilometer,
            drop_lat: area.latitude,
            drop_lng: area.longitude
        }));
    };





    useEffect(() => {
        // Check if all the required latitude and longitude values are not null

        if (kilometer.pick_lat !== null && kilometer.pick_lng !== null && kilometer.drop_lat !== null && kilometer.drop_lng !== null) {
            // Create LatLng objects
            const origin = new window.google.maps.LatLng(kilometer.pick_lat, kilometer.pick_lng);
            const destination = new window.google.maps.LatLng(kilometer.drop_lat, kilometer.drop_lng);

            // Call the distance matrix service
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC,
                },
                callback
            );
        }
    }, [kilometer, vechicleSelect]);

    async function callback(response: any, status: any) {
        if (status === 'OK') {
            const distanceInMeters = response.rows[0].elements[0].distance.value;
            const distanceInKm = distanceInMeters / 1000;
            //   setDistance(distanceInKm.toFixed(2));


            const value: any = {
                vehicle_type: getValues('vehicle_type'),
                pickup_location_coordinates: [kilometer.pick_lat, kilometer.pick_lng],
                kilometer: distanceInKm.toFixed(2)
            }
            try {
                const resp = await postData('customer/pickup-drop-charge', value)
                const data = resp?.data?.data;
                setValue('grand_total', data.pickup_and_drop_charge_amount)
                setValue('franchise', resp?.data?.data?.franchise_id)
                setError('grand_total', { message: '' })
            } catch (err: any) {
                setValue('grand_total', '')
                setValue('franchise', '')
                toast.error(err?.message)

            }

        } else {
            console.error('Error:', status);
        }
    }


    const onselectVechicle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const find = vechicleList?.find((res: any) => res?._id === value)
        setValue('vehicle_type', find?.name)
        setError('vehicle_type', { message: '' })
        setVechicleSelect(value)
    }

    const pickupDate = (e: any) => {

        setValue('pickup_date', e)
    }


    const pickupTime = (e: any) => {
        setValue('pickup_time', e)
    }

    // const DateTimeFilter = (e: any) => {
    //     setValue('delivery_date', e)
    // }

    const removeImage = (name: string) => {
        const result = defaultImage?.filter((res: any) => res !== name)
        setdefaultImage([...result])

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


    const SubmitOrder = async (data: any) => {
        console.log({ data })
        const formData = new FormData();
        const type: any = process?.env?.NEXT_PUBLIC_TYPE

        if (multipleImage?.length > 0) {
            multipleImage?.map((img: any, i: number) => {
                formData.append(`images[${i}]`, img.file);
            })


        }
        formData.append('name', data.name)
        formData.append('mobile', data.mobile)
        formData.append('email', data.email)
        formData.append('item_name', data.item_name)
        formData.append('description', data.description)
        formData.append('weight', data.weight)
        formData.append('vehicle_type', data.vehicle_type)
        formData.append('pickup_location', data.pickup_location)
        formData.append('drop_off_location', data.drop_off_location)
        formData.append('payment_type', data.payment_type)
        formData.append('payment_status', data.payment_status)
        formData.append('pickup_location_coordinates', JSON.stringify(data.pickup_location_coordinates))
        formData.append('drop_off_location_coordinates', JSON.stringify(data.drop_off_location_coordinates))
        formData.append('billing_address', data.billing_address)
        formData.append('shipping_address', data.shipping_address)
        formData.append('grand_total', data.grand_total)
        formData.append('franchise', data.franchise)
        formData.append('pickup_date', moment(data.pickup_date).format('YYYY-MM-DD'))
        formData.append('pickup_time', moment(data.pickup_time).format('hh:mm'))
        formData.append('delivery_date', moment(data.delivery_date).format('YYYY-MM-DD hh:mm'))
        formData.append('type', type)



        try {

            await postData('admin/pickup-drop/create', formData)
            // router.push('/shipments')
            toast.success('Order Create Successfully')
            router.back()

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }

        // }

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
                            fieldLabel={"PickUp Item Name"}
                            disabled={false}
                            view={view ? true : false}
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

                    {/* <Grid item xs={12} lg={2}>
                        <CustomDateTimePicker
                            disabled={view ? true : false}

                            changeValue={(value: any) => DateTimeFilter(value)}
                            fieldName='delivery_date'
                            control={control}
                            error={errors.delivery_date}
                            fieldLabel={'Delivery Date & Time'}
                        />
                    </Grid> */}

                    <Grid item xs={12} lg={2}>
                        <CustomDatePicker
                            values={''}
                            disabled={view ? true : false}
                            changeValue={(e) => pickupDate(e)}
                            fieldName='pickup_date'
                            control={control}
                            error={errors.pickup_date}
                            fieldLabel={'Pickup Date'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomTimepicker
                            changeValue={(e) => pickupTime(e)}
                            fieldName='pickup_time'
                            control={control}
                            disabled={view ? true : false}
                            error={errors.pickup_time}
                            fieldLabel={'Pickup Time'} />


                    </Grid>
                    {idd && <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.pickup_location}
                            fieldName="pickup_location"
                            placeholder={``}
                            fieldLabel={"Pickup Location"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>}
                    {view &&
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.drop_off_location}
                                fieldName="drop_off_location"
                                placeholder={``}
                                fieldLabel={"Drop Off Location"}
                                disabled={false}
                                view={view ? true : false}
                                defaultValue={''}
                            />
                        </Grid>}

                    {/* <Grid item xs={12} lg={3}>
                        <CustomTextarea
                            // type='text'
                            control={control}
                            error={errors.billing_address}
                            fieldName=".billing_address"
                            placeholder={``}
                            fieldLabel={"Billing Address"}
                            disabled={false}
                            view={idd ? true : false}
                            defaultValue={''}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12} lg={3}>
                        <CustomTextarea
                            control={control}
                            // type='text'
                            error={errors.shipping_address}
                            fieldName="shipping_address"
                            placeholder={``}
                            fieldLabel={"Shipping Address"}
                            disabled={false}
                            view={idd ? true : false}
                            defaultValue={''}
                        />
                    </Grid> */}

                    {!idd && <Grid item xs={12} lg={3}>
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
                        >{'Pickup Location'}

                        </Typography>
                        <GoogleAutocomplete

                            apiKey={process.env.NEXT_PUBLIC_GOOGLEKEY}
                            style={{ height: 40, width: '100%' }}
                            onPlaceSelected={(e: any) => handlePlaceSelectedPick(e)}

                            types={['(regions)']}
                        />

                    </Grid>}
                    {!idd &&
                        <Grid item xs={12} lg={3}>
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
                            >{'DropUp Location'}

                            </Typography>
                            <GoogleAutocomplete
                                apiKey={process.env.NEXT_PUBLIC_GOOGLEKEY}
                                style={{ height: 40, width: '100%' }}
                                onPlaceSelected={(e: any) => handlePlaceSelectedDrop(e)}
                                types={['(regions)']}

                            />

                        </Grid>}
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.vehicle_type}
                            fieldName="vehicle_type"
                            placeholder={``}
                            fieldLabel={"Vechicle Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={vechicleSelect}
                            options={''}
                            onChangeValue={onselectVechicle}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Franchise</>
                            </MenuItem>
                            {vechicleList && vechicleList?.map((res: any) => (
                                <MenuItem value={res?._id}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>


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
                    {idd && <Grid item xs={12} lg={6}>
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
                    {!idd &&
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


                            <div style={{ height: '200px', overflow: 'auto' }}>
                                {!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />}
                            </div>

                        </Grid>}
                </Grid>
            </CustomBox>
            <CustomBox title='Payment'>
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
                </Grid>
            </CustomBox>

            {!idd && <Box py={3} display={'flex-container'} justifyContent={'center'}>
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