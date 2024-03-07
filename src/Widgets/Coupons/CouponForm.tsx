
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
import CustomMultiselect from '@/components/CustomMultiselect';

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
        coupon_code: any,
        expiry_date: any,
        limitation: any,
        minimum_cart_value: any,
        coupon_description: string,
        type: string,
        franchise_id: any,
        store_id: any,
        coupon_for: any

    }

    const { id } = router.query
    const [type, setType] = useState<string | null>(null);

    const [franchiseList, setFranchiseList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [singleList, setSingleList] = useState<any>(null)
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [vendorList, setVendorList] = useState<any>([])
    const [vendorSelect, setvendorSelect] = useState<any>(null);
    const [discount, setDiscount] = useState<null | string>(null)
    const [dateE, setDateE] = useState<any>(null)
    const [multpleArray, setMultipleArray] = useState<any>([]);





    const orderValidation = /^[0-9]*$/

       let validationS = {
        coupon_title: yup
            .string()
            .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
            .max(40)
            .required('Required'),
        discount_type: yup
            .string().required('Required'),
        coupon_for: yup
            .string().required('Required'),
        coupon_value: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
        coupon_code: yup.string().matches(/^(?=.*[A-Z])(?=.*\d).{8}$/
        , 'use uppercase or number and 8 character ').nullable().required('Required'),
        limitation: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
        minimum_cart_value: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required')
      
    }
  
   
  



    const schema = yup
        .object()
        .shape(validationS)

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
      

        setValue('franchise_id', e.target?.value)
        setValue('store_id', null)
        setError('franchise_id', { message: '' })
        setFranchiseSelect(e.target.value)
        try {
            setLoading(true)
             setvendorSelect(null)
            const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)

            setVendorList(response?.data?.data)


        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)

        }


    }

    const getSingleShow = async () => {

        try {
            setLoading(true)
            const resp = await fetchData(`admin/coupons/show/${id}`)
            setSingleList(resp?.data?.data)
        } catch (err: any) {

        } finally {
            setLoading(false)
        }

    }


    useEffect(() => {
        if (view || res) {
            getSingleShow()
        }
    }, [])

    useEffect(() => {
        const fetchDataAndSetValues = async () => {
            if (singleList && franchiseList) {
                setValue('coupon_code', singleList.coupon_code);
                setValue('coupon_title', singleList.coupon_title);
                setValue('coupon_description', singleList.coupon_description);
                setValue('limitation', singleList.limitation);
                setValue('minimum_cart_value', singleList.minimum_cart_value);
                setValue('coupon_value', singleList.coupon_value);
                setType(singleList.coupon_for);
                setDiscount(singleList?.discount_type)
                setValue('discount_type', singleList?.discount_type)
                setValue('coupon_for', singleList.coupon_for);
                setValue('expiry_date', singleList?.expiry_date ? moment(singleList?.expiry_date, 'YYYY-MM-DD') : null)
                setDateE(singleList?.expiry_date ? moment(singleList?.expiry_date, 'YYYY-MM-DD') : null)

                if (singleList.coupon_for === "franchise") {
                    setValue('franchise_id', singleList.franchise_id);
                    setFranchiseSelect(singleList.franchise_id)
                } else if (singleList.coupon_for === "store") {
                    try {
                        setValue('franchise_id', singleList.franchise_id);
                        setFranchiseSelect(singleList.franchise_id)
                        const response = await fetchData(`admin/vendor-list/${singleList.franchise_id}/${process.env.NEXT_PUBLIC_TYPE}`);
                        setVendorList(response?.data?.data);
                        setvendorSelect(singleList?.store_id)
                    } catch (error) {
                        // Handle error
                        console.error("Error fetching vendor list:", error);
                    }
                }
            }
        };

        fetchDataAndSetValues();
    }, [singleList, franchiseList]);

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
        setValue('expiry_date',e)

    }




    const submitCoupon = async (data: any) => {
 
        const CreateURL = 'admin/coupons/create'
        const EditUrl = 'admin/coupons/update'
        // data.store_id = Array.from(new Set(data?.store_id))
        data.expiry_date = moment(data.expiry_date).format('YYYY-MM-DD')
        if(type === 'franchise' && !franchiseSelect){
            toast.warn('Franchise is required');
            return false
        }else if (type === "store" && !vendorSelect && !franchiseSelect){
            toast.warn('Franchise and store is required');
            return false
        }

        if(res){
            data.id = id
        }
        try {
            setLoading(true)
            await postData(res ? EditUrl : CreateURL, { ...data });
            toast.success( res ? 'Updated Successfully' :'Created Successfully');
            router.push('/coupons')
            reset();
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
                            view={(view || singleList?.offer_applied) ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <Customselect
                            disabled={(view || singleList?.offer_applied) ? true : false}
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
                            view={(view || singleList?.offer_applied) ? true : false}
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
                            view={(view || singleList?.offer_applied) ? true : false}
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
                            view={view ? true : false}
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
                            disabled={view ? true : false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <Customselect
                            disabled={(view || singleList?.offer_applied) ? true : false}
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
                                disabled={view ? true : false}
                                type='text'
                                control={control}
                                error={errors.store_id}
                                fieldName="store_id"
                                placeholder={``}
                                fieldLabel={"Store"}
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
                                {vendorList && vendorList.map((res: any) => (
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
                            view={view ? true : false}
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
