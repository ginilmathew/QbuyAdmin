import CustomInput from '@/components/CustomInput'
import { Box, Grid, MenuItem } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTextarea from '@/components/CustomTextarea';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import moment from 'moment';
import { useRouter } from 'next/router';

type props = {
    res?: any
    view?: any
}
const CouponForm = ({ res, view }: props) => {
    const router = useRouter()

    type IFormInput = {
        coupon_title: string,
        discount_type: string,
        coupon_value: string,
        coupon_code: string,
        expiry_date: string,
        limitation: any,
        minimum_cart_value: any,
        coupon_description: string,
        type: string,
        franchise_id: any,
        store_id: any,
        coupon_for: any

    }

    const orderValidation = /^[0-9]*$/
    const schema = yup
        .object()
        .shape({
            coupon_title: yup
                .string()
                .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
                .max(40)
                .required(),
            discount_type: yup
                .string().required('Required'),
            coupon_for: yup
                .string().required('Required'),
            coupon_value: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
            coupon_code: yup.string().matches(/^[(a-z 0-9)]+$/gi, 'Accept only positive number').nullable().required('Required'),
            limitation: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
            minimum_cart_value: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required')

        })

    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue, } = useForm<IFormInput>(
            {
                resolver: yupResolver(schema),
                defaultValues: {
                    coupon_title: '',
                    type: process?.env?.NEXT_PUBLIC_TYPE

                }
            }
        );


    const [type, setType] = useState<string | null>(null);

    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [vendorList, setVendorList] = useState<any>([])
    const [vendorSelect, setvendorSelect] = useState<any>(null);
    const [discount, setDiscount] = useState<null | string>(null)
    const [dateE, setDateE] = useState<any>(null)

    const getFranchiseList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/franchise/list')
            setFranchiseList(response?.data?.data)

        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getFranchiseList()
    }, [])


    const onSelectDiscountType = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(e.target.value)
        setValue('discount_type', e.target.value)
        setError('discount_type', { message: '' })
    }


    const onChageType = (e: any) => {
        const { value } = e.target;
        setType(value)
        setValue('coupon_for', value)
        setValue('franchise_id', '')
        setValue('store_id', '')
        setFranchiseSelect(null)
        setvendorSelect(null)
        setError('coupon_for', { message: '' })
    }

    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)

        setValue('franchise_id', e.target?.value)
        setValue('store_id', null)
        setError('franchise_id', { message: '' })
        setFranchiseSelect(e.target.value)
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)

            setVendorList(response?.data?.data)


        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)

        }


    }



    const onSelectStore = (e: React.ChangeEvent<HTMLInputElement>) => {

        setvendorSelect(e.target.value)
        // let result = vendorList?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
        //     {
        //         commision: get?.additional_details ? get?.additional_details.commission : null,
        //         id: get?._id,
        //         name: get?.store_name,
        //         category: get?.category_id
        //     }

        // ))
        setValue('store_id', e.target.value)
        setError('store_id', { message: '' })


    }


    const onChangeExper = (e: any) => {
        setDateE(e)
        setValue('expiry_date', moment(e).format('YYYY-MM-DD'))

    }




    const submitCoupon = async (data: any) => {
        const CreateURL = 'admin/coupons/create'

        try {
            setLoading(true)
            await postData(CreateURL, { ...data });
            toast.success( 'Created Successfully');
            router?.push('/coupons')
            reset()
            

        } catch (err: any) {
            toast.error(err.message)

        } finally {
            setLoading(false)
        }

    }

    return (
        <Box>
            <CustomBox title='Coupon/Promo Code Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.coupon_title}
                            fieldName="coupon_title"
                            placeholder={``}
                            fieldLabel={"Coupon Title"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.discount_type}
                            fieldName="discount_type"
                            placeholder={``}
                            fieldLabel={"Discount Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={discount}
                            options={''}
                            onChangeValue={onSelectDiscountType}
                            background={'#fff'}
                        >
                            <MenuItem value={'percentage'}>Percentage</MenuItem>
                            <MenuItem value={'flat'}>Flat</MenuItem>

                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.coupon_value}
                            fieldName="coupon_value"
                            placeholder={``}
                            fieldLabel={"Coupon Value"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.coupon_code}
                            fieldName="coupon_code"
                            placeholder={``}
                            fieldLabel={"Coupon Code"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomDatePicker
                            values={dateE}
                            changeValue={onChangeExper}
                            fieldName='expiry_date'
                            control={control}
                            error={errors.expiry_date}
                            fieldLabel={'Expiry Date'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.limitation}
                            fieldName="limitation"
                            placeholder={``}
                            fieldLabel={"Limitations"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.minimum_cart_value}
                            fieldName="minimum_cart_value"
                            placeholder={``}
                            fieldLabel={"Minimum Cart Value"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.coupon_for}
                            fieldName="coupon_for"
                            placeholder={``}
                            fieldLabel={"Coupon Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={type}
                            options={''}
                            onChangeValue={onChageType}
                            background={'#fff'}
                        >
                            <MenuItem value={'franchise'}>Franchise</MenuItem>
                            <MenuItem value={'store'}>Store</MenuItem>
                            <MenuItem value={'all'}>All</MenuItem>
                        </Customselect>
                    </Grid>
                    {(type == "store" || type === 'franchise') &&
                        <Grid item xs={12} lg={2.4}>
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
                                value={franchiseSelect}
                                options={''}
                                onChangeValue={onselectFranchise}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Franchise</>
                                </MenuItem>
                                {franchiseList && franchiseList?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
                                    <MenuItem value={res?._id}>{res?.franchise_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>}
                    {type == "store" &&
                        <Grid item xs={12} lg={2.4}>
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.store_id}
                                fieldName="store_id"
                                placeholder={``}
                                fieldLabel={"Store Name"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={vendorSelect}
                                options={''}
                                onChangeValue={onSelectStore}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Store</>
                                </MenuItem>
                                {vendorList && vendorList?.map((res: any) => (
                                    <MenuItem value={res?._id}>{res?.store_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>}
                    {/* <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Locality"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid> */}
                    <Grid item xs={12} lg={4.8}>
                        <CustomTextarea

                            control={control}
                            error={errors.coupon_description}
                            fieldName="coupon_description"
                            placeholder={``}
                            fieldLabel={"Coupon/Promo Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            {!view &&
                <Box py={3}>
                    <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? "Edit Coupon" : 'Add Coupon'} onClick={handleSubmit(submitCoupon)} />
                </Box>}
        </Box>
    )
}

export default CouponForm
