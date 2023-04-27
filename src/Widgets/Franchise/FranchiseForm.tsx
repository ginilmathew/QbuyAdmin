import { FormInputs } from '@/utilities/types';
import React, { useEffect, useState } from 'react'
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
import { Route } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import Polygons from '@/components/maps/Polygon';


type Inputs = {
    franchise_name: string,
    owner_name: string,
    email: string,
    mobile: string,
    address: string,
    coordinates: any,
    franchisee_commission: any
}

type IFormInput = {
    franchise_name: string,
    owner_name: string,
    email: string,
    mobile: string,
    address: string,
    coordinates: any,
    franchisee_commission: any
}
type props = {
    res?: any,
    view?: any
}


const FranchiseForm = ({ res, view }: props) => {
    let dataRes = res ? res : view
    console.log({ dataRes })

    const [paths, setPaths] = useState(null)

    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false)
    const commissionvalidation = /^(0|[1-9]\d*)$/
    const schema = yup
        .object()
        .shape({
            franchise_name: yup.string().max(30, 'Maximum Character Exceeds').required('Franchise Name is Required'),
            owner_name: yup.string().max(30, 'Maximum Character Exceeds').required('Owner Name is Required'),
            email: yup.string().max(30, 'Maximum Character Exceeds').email('not a valid email').required('Email is Required'),
            mobile: yup.number()
                .typeError("A Mobile number is required")
                .positive("A mobile number can't start with a minus")
                .integer("A mobile number can't include a decimal point")
                .min(10)
                .required('A Mobile number is required'),
            //address: yup.string().required('Address is Required'),
            coordinates: yup.array().required("Delivery Location Required").typeError("Delivery Location Required"),
            franchisee_commission: yup.string().matches(commissionvalidation, 'Accept Number Only').required('Commission is Required')

        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                franchise_name: '',
                owner_name: '',
                email: '',
                mobile: '',
                address: '',
                coordinates: null,
                franchisee_commission: '',
            }
        });


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true)

        const url_Create = '/admin/franchise/create'
        const url_Edit = 'admin/franchise/update'

        const create_data = data
        const edit_Data = {
            ...data,
            id: res?._id
        }

        try {
            await postData(res ? url_Edit : url_Create, res ? edit_Data : create_data)
            toast.success(res ? 'Edited Successfully' : 'Created Successfully')
            router.push(`/franchise`)
            reset()
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const setDeliveryLocation = (value: any) => {
        if (!view) {
            setValue("coordinates", value)
        }

    }

    useEffect(() => {
        if (res || view) {
            let data = res ? res : view
            setValue('franchise_name', data?.franchise_name)
            setValue('owner_name', data?.owner_name)
            setValue('email', data?.email)
            setValue('mobile', data?.mobile)
            setValue('address', data?.address)
            setValue('franchisee_commission', data?.franchisee_commission)
            let paths = data?.delivery_location?.map((loc: any) => {
                return {
                    lat: parseFloat(loc[0]),
                    lng: parseFloat(loc[1])
                }
            })
            setPaths(paths)
            setValue('coordinates', data?.delivery_location)
        }
    }, [res, view])


    return (
        <Box>
            <CustomBox title='Franchisee Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise_name}
                            fieldName="franchise_name"
                            placeholder={``}
                            fieldLabel={"Franchisee Name"}
                            disabled={false}
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchisee_commission}
                            fieldName="franchisee_commission"
                            placeholder={``}
                            fieldLabel={"Commission(%)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Divider />
                </Box>
                {dataRes ? <Polygons onComplete={setDeliveryLocation} path={paths} /> : <Maps onPolygonComplete={setDeliveryLocation} />}
                {errors && <span style={{ color: 'red', fontSize: 12 }}>{`${errors?.coordinates ? errors?.coordinates?.message : ''}`}</span>}
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
                        label={res ? 'Update' : 'Add Franchisee'}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    />
                </Box>}
        </Box>
    )
}

export default FranchiseForm