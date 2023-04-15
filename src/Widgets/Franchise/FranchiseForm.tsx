import { FormInputs } from '@/utilities/types';
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Divider, Grid, MenuItem } from '@mui/material'
import CustomInput from '@/components/CustomInput';
import CustomBox from '../CustomBox';
import Custombutton from '@/components/Custombutton';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { postData } from '@/CustomAxios';
import Maps from '@/components/maps/maps';

type Inputs = {
    franchise_name: string,
    owner_name: string,
    email: string,
    mobile: string,
    address: string,
    coordinates: any
}

type IFormInput = {
    franchise_name: string,
    owner_name: string,
    email: string,
    mobile: string,
    address: string,
    coordinates: any
}


const FranchiseForm = () => {

    const [loading, setLoading] = useState<boolean>(false)

    const schema = yup
        .object()
        .shape({
            franchise_name: yup.string().required('Franchise Name is Required'),
            owner_name: yup.string().required('Owner Name is Required'),
            email: yup.string().email('Email is valid').required('Email is Required'),
            mobile: yup.number()
            .typeError("That doesn't look like a mobile number")
            .positive("A mobile number can't start with a minus")
            .integer("A mobile number can't include a decimal point")
            .min(10)
            .required('A Mobile number is required'),
            //address: yup.string().required('Address is Required'),
            coordinates: yup.array().required("Delivery Location Required").typeError("Delivery Location Required")
        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues:{
                franchise_name: '',
                owner_name: '',
                email: '',
                mobile: '',
                address: '',
                coordinates: null
            }
        });


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true)
        try {
            await postData('/admin/franchise/create', data)
            toast.success('Created Successfully')
            reset()
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const setDeliveryLocation = (value: any) => {
        setValue("coordinates", value)
    }

    return (
        <Box>
            <CustomBox title='Franchise Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise_name}
                            fieldName="franchise_name"
                            placeholder={``}
                            fieldLabel={"Franchise Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.owner_name}
                            fieldName="owner_name"
                            placeholder={``}
                            fieldLabel={"Owner Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
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
                    <Grid item xs={12} lg={3}>
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
                    <Grid item xs={12} lg={9}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.address}
                            fieldName="address"
                            placeholder={``}
                            fieldLabel={"Address"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Divider />
                </Box>
                <Maps onPolygonComplete={setDeliveryLocation} />
                {errors  && <span style={{ color: 'red', fontSize: 12 }}>{`${errors?.coordinates?.message}`}</span>}
            </CustomBox>
            <Box py={3}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Add Franchise'}
                    onClick={handleSubmit(onSubmit)} 
                    disabled={loading}
                    />
            </Box>
        </Box>
    )
}

export default FranchiseForm