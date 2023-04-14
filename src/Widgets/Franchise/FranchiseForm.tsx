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
            // franchise_name: yup.string().required('Franchise Name is Required'),
            // owner_name: yup.string().required('Owner Name is Required'),
            // email: yup.string().email('Email is valid').required('Email is Required'),
            // mobile: yup.number()
            // .typeError("That doesn't look like a mobile number")
            // .positive("A mobile number can't start with a minus")
            // .integer("A mobile number can't include a decimal point")
            // .min(10)
            // .required('A Mobile number is required'),
            // address: yup.string().required('Address is Required'),
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
            }
        });


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true)
        let value = {
            ...data,
            coordinates: [
                [8.670514, 76.770417],
                [8.770963, 77.179658],
                [8.464103, 77.333466],
                [8.347269, 77.185151],
                [8.311940, 77.064301],
                [8.662368, 76.775910]
            ]
        }
        try {
            await postData('/admin/franchise/create', value)
            toast.success('Created Successfully')
            reset()
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
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
                <p>map</p>
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