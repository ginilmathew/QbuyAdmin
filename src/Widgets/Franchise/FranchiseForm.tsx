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
import { fetchData, postData } from '@/CustomAxios';
import Maps from '@/components/maps/maps';
import { Route } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import Polygons from '@/components/maps/Polygon';
import CustomLoader from '@/components/CustomLoader';


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

    let idd = res ? res : view

    const [franchiseList, setFranchiseList] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)





    const getFranchise = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/franchise/show/${idd}`)
            setFranchiseList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        if (res || view) {
            getFranchise()
        }

    }, [res || view])




    const [paths, setPaths] = useState(null)

    const router = useRouter()


    const commissionvalidation: any = /^\d*\.?\d*$/

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


    const schema = yup
        .object()
        .shape({
            franchise_name: yup.string().max(30, "Name must be less than 30 characters").matches(
                /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
                'Name can only contain Latin letters.'
            )
                // .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.')
                .required('Name is Required'),
            owner_name: yup.string().max(30, "Name must be less than 30 characters").matches(
                /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
                'Name can only contain alphabets letters.'
            )
                // .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.')
                .required('Owner Name is Required'),
            email: yup.string().max(30, 'Maximum Character Exceeds').email('Not a valid email').required('Email is Required'),
            mobile: yup.string().required('Mobile Number is Required').matches(phoneRegExp, 'Mobile number is not valid').min(10, 'Mobile Number must be minimum 10 digit').max(10, 'Mobile number is not valid'),
            //address: yup.string().required('Address is Required'),
            coordinates: yup.array().required("Delivery Location Required").typeError("Delivery Location Required"),
            franchisee_commission: yup.number().required('Commission is required')
                .nullable('Commission is Required').typeError('Commission is required')
                .notRequired()
                .min(0)
                .max(100, "Commision have maximum 100%")
                .test(
                    "noEOrSign", // type of the validator (should be unique)
                    "Number had an 'e' or sign.", // error message
                    (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
                )


        })
    


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
            id: franchiseList?._id
        }

        try {
            await postData(idd ? url_Edit : url_Create, idd ? edit_Data : create_data)
            toast.success(idd ? 'Edited Successfully' : 'Created Successfully')
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
        if (franchiseList) {
            let data = res ? res : view
            setValue('franchise_name', franchiseList?.franchise_name)
            setValue('owner_name', franchiseList?.owner_name)
            setValue('email', franchiseList?.email)
            setValue('mobile', franchiseList?.mobile)
            setValue('address', franchiseList?.address)
            setValue('franchisee_commission', franchiseList?.franchisee_commission)
            let paths = franchiseList?.delivery_location?.map((loc: any) => {
                return {
                    lat: parseFloat(loc[0]),
                    lng: parseFloat(loc[1])
                }
            })
            setPaths(paths)
            setValue('coordinates', franchiseList?.delivery_location)
        }
    }, [franchiseList])

    if (loader) {
        return <><CustomLoader /></>
    }

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
                {idd ? <Polygons onComplete={setDeliveryLocation} path={paths} /> : <Maps onPolygonComplete={setDeliveryLocation} />}
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