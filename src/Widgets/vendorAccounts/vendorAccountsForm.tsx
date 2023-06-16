import { Avatar, Box, Grid, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomBox from '../CustomBox';
import { fetchData } from '@/CustomAxios';
import CustomInput from '@/components/CustomInput';
import CustomMultiselect from '@/components/CustomMultiselect';
import { IMAGE_URL } from '@/Config';
import CustomTimepicker from '@/components/CustomTimepicker';


type Inputs = {
    vendor_name: string,
    vendor_email: string,
    vendor_mobile: string,
    email: string,
    category: string,
    store_name: string,
    store_address: string,
    franchise: string,
    category_id: any,
    start_time: any,
    end_time: any
}
type props = {
    idd: any;
}

const VendorAccountsForm = ({ idd }: props) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [vendorSingleList, setVendorSinglelist] = useState<any>(null);
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [getcategory, setGetCategory] = useState<any>([])
    console.log({ vendorSingleList })


    const schema = yup
        .object()
        .shape({


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



            }
        });


    const viewVendor = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetchData(`admin/account/vendors/show/${idd}`);
            setVendorSinglelist(res?.data?.data)
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
        }
    }, [idd])

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
        let array = vendorSingleList?.category_id?.map((res: any) => res?.id)
        if (vendorSingleList && array) {
            setValue('vendor_name', vendorSingleList?.vendor_name);
            setValue('vendor_email', vendorSingleList?.vendor_email);
            setValue('vendor_mobile', vendorSingleList?.vendor_mobile);
            setValue('store_name', vendorSingleList?.store_name);
            setValue('category_id', vendorSingleList?.category_id)
            setMultipleArray(array);
            setValue('store_address', vendorSingleList?.store_address);
            setValue('franchise', vendorSingleList?.franchise?.franchise_name);
            setValue('start_time',vendorSingleList?.start_time)
            setValue('end_time',vendorSingleList?.start_time)

        }
    }, [vendorSingleList])




    useEffect(() => {
        if (idd) {
            viewVendor();
            getCategoryList();
        }
    }, [idd])

    if (!vendorSingleList) {
        return <>Loading...</>
    }

    return (
        <Box>
            <CustomBox title='vendor Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_name}
                            fieldName="vendor_name"
                            placeholder={``}
                            fieldLabel={"Vendor Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_email}
                            fieldName="vendor_email"
                            placeholder={``}
                            fieldLabel={"Vendor Email"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_mobile}
                            fieldName="vendor_mobile"
                            placeholder={``}
                            fieldLabel={"Vendor Mobile"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Store Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.store_name}
                            fieldName="store_name"
                            placeholder={``}
                            fieldLabel={"Store Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.store_address}
                            fieldName="store_address"
                            placeholder={``}
                            fieldLabel={"Address"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise}
                            fieldName="franchise"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

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
                            onChangeValue={() => null}
                            type=''
                        >
                            <MenuItem value="" disabled >
                                <>Select Category</>
                            </MenuItem>
                            {getcategory && getcategory.map((res: any) => (
                                <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                            ))}
                        </CustomMultiselect>

                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomTimepicker
                            disabled={true}
                            changeValue={() => null}
                            fieldName='start_time'
                            control={control}
                            error={errors.start_time}
                            fieldLabel={'Store Time'} />

                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <CustomTimepicker
                            disabled={true}
                            changeValue={() => null}
                            fieldName='end_time'
                            control={control}
                            error={errors.start_time}
                            fieldLabel={''} />

                    </Grid>
               
                    <Grid item xs={12} lg={3}>
                        <Typography>Store Logo/Image</Typography>
                        <Avatar variant='square' src={`${IMAGE_URL}${vendorSingleList?.original_store_logo}`} sx={{ width: '100%', height: 130 }} />
                    </Grid>
                </Grid>

            </CustomBox>
        </Box>
    )
}

export default VendorAccountsForm