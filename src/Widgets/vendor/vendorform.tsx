import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography,MenuItem } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import CustomImageUploader from '@/components/CustomImageUploader';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import { DrawingManager, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader, } from '@react-google-maps/api';

const Vendorform = () => {
    const [map, setMap] = useState<null>(null)

    const [imagefile, setImagefile] = useState<null | File>(null)
    const [category,setCategory]=useState<string>('')

    console.log({ imagefile })

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();








    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I",
        id: 'google-map-script',
    })



    const containerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '5px 5px 5px 5px'
    };

    const center = {
        lat: -3.745,
        lng: -38.523
    };


    const paths = [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 }
    ]

    const options = {
        fillColor: "lightblue",
        fillOpacity: 1,
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true,
        draggable: true,
        editable: true,
        geodesic: true,
        zIndex: 1
    }

    const onLoad = (polygon: any) => {
        console.log("polygon: ", polygon);
    }





    const position = {
        lat: 37.772,
        lng: -122.214
    }


    const imageUploder = (file: any) => {
        setImagefile(file)
        console.log({ file })
    }


    const onChangeSelect = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCategory(e.target.value)

    }


    return (
        <Box>
            <CustomBox title='Vendor Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                                error={errors.storename}
                                fieldName="storeName"
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
                                error={errors.email}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Address"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Franchise"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <Customselect
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Category"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={category}
                                options={''}
                                onChangeValue={onChangeSelect}
                                background={'#fff'}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Customselect>
                        </Grid>
                        <Grid item xs={12} lg={2.1}>
                            <CustomInput
                                type='time'
                                control={control}
                                error={errors.opentime}
                                fieldName="openAt"
                                placeholder={``}
                                fieldLabel={"Store Time"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={2.1}>
                            <Typography mb={3.2}></Typography>
                            <CustomInput
                                type='time'
                                control={control}
                                error={errors.closetime}
                                fieldName="closeAt"
                                placeholder={``}
                                fieldLabel={""}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                    </Grid>
                    <Box flex={.3} sx={{}}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.closetime}
                            fieldName="logo/image"
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
                            width={"50%"}
                        />
                    </Box>
                </Box>
                <Box py={2}>
                    <Divider />
                    {isLoaded &&
                        <Box py={1}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={10}
                                options={{

                                    scrollwheel: false,
                                    disableDoubleClickZoom: true,
                                    zoomControl: false,
                                    gestureHandling: 'none',
                                    fullscreenControl: false,
                                    streetView: null,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    disableDefaultUI: true,
                                    styles: [{ elementType: "labels", featureType: "poi.business", stylers: [{ visibility: "off", }], }]
                                }}
                            // onLoad={onLoad}
                            // onUnmount={onUnmount}
                            >

                                <Polygon
                                    onLoad={onLoad}
                                    paths={paths}
                                    options={options}
                                />

                            </GoogleMap>
                        </Box>}
                </Box>
            </CustomBox>
            <CustomBox title='KYC Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
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
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Tax"}
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
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Vendor'} onClick={() => null} />
            </Box>
        </Box>
    )
}

export default Vendorform