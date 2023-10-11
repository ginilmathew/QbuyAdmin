import { Avatar, Box, Grid, MenuItem, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CustomBox from '@/Widgets/CustomBox';
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { fetchData, postData } from '@/CustomAxios';
import { Message } from '@mui/icons-material';
import { IMAGE_URL } from '@/Config';
import { useRouter } from 'next/router';
import CustomLoader from '@/components/CustomLoader';
import moment from 'moment';


type ProductDetails = {
    name: string;
    image: string;
    productdata: {
        store: {
            name: string;
        };
        category: {
            name: string;
        };
    };
    quantity: number;
};

type UserData = {
    name: string;
    mobile: string;
    email: string;
    created_at: string;

};

type AbandonedData = {
    product_details: ProductDetails[];
    user: UserData;
    updated_at: string;

};

type Props = {
    resData?: AbandonedData;
    view?: any;
};


const AbandonedForm = ({ resData, view }: Props) => {
    const idd = resData ? resData : view;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [abandonedData, setAbandonedData] = useState<AbandonedData | null>(null);
    const [searchList, setSearchList] = useState([]);
    const customerName = resData?.user?.name || '';
    const mobileNumber = resData?.user?.mobile || '';
    const emailAddress = resData?.user?.email || '';
    const dateViewed = resData?.updated_at || '';

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue,
    } = useForm<any>({
        defaultValues: {
            name: '',
            mobile: '',
            email: '',
            created: '',
            store_address: '',
            quantity: '',
            names: '',
            store: '',
            category: '',
        },
    });

    const abandonedCart = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/abandoned/show/${idd}`);
            setAbandonedData(response?.data?.data);
            setSearchList(response?.data?.data);
        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idd) {
            abandonedCart();
        }
    }, [idd]);


    useEffect(() => {
        if (abandonedData && abandonedData.product_details && abandonedData.product_details.length > 0) {
            abandonedData.product_details.forEach((product, index) => {
                setValue(`names[${index}]`, product?.name);
                setValue(`store[${index}]`, product?.productdata?.store?.name);
                setValue(`category[${index}]`, product?.productdata?.category?.name);
                setValue(`quantity[${index}]`, product?.quantity);
            });
            setValue('name', abandonedData?.user?.name);
            setValue('mobile', abandonedData?.user?.mobile);
            setValue('email', abandonedData?.user?.email);
            setValue('created', abandonedData?.user?.created_at);
        }
    }, [abandonedData, setValue]);



    return (
        <Box>
            <CustomBox title='Customer Details'>
                <Grid container flex={.7} spacing={2}>
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
                            type='number'
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
                    <Grid item xs={12} lg={2.5}>
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
                </Grid>
            </CustomBox>
            <CustomBox title="Abandoned Details">
                {abandonedData?.product_details?.map((product, index) => (
                    <Box key={index} display="flex" flexDirection="column">
                        <Grid container flex={0.7} spacing={2}>
                            <Grid item xs={12} lg={3}>
                                <Typography>Product Image</Typography>
                                <Avatar
                                    variant="square"
                                    src={IMAGE_URL + product?.image}
                                    sx={{ width: '85%', height: 130 }}
                                />
                            </Grid>
                            <Grid container flex={0.9} spacing={2} sx={{ paddingTop: '22px' }}>
                                <Grid item xs={12} lg={3}>
                                    <CustomInput
                                        type="text"
                                        control={control}
                                        error={errors[`names[${index}]`]}
                                        fieldName={`names[${index}]`}
                                        placeholder={``}
                                        fieldLabel="Product Name"
                                        disabled={false}
                                        view={view ? true : false}
                                        defaultValue={product?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <CustomInput
                                        type="text"
                                        control={control}
                                        error={errors[`store[${index}]`]}
                                        fieldName={`store[${index}]`}
                                        placeholder={``}
                                        fieldLabel="Store Name"
                                        disabled={false}
                                        view={view ? true : false}
                                        defaultValue={product?.productdata?.store?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <CustomInput
                                        type="text"
                                        control={control}
                                        error={errors[`category[${index}]`]}
                                        fieldName={`category[${index}]`}
                                        placeholder={``}
                                        fieldLabel="Category"
                                        disabled={false}
                                        view={view ? true : false}
                                        defaultValue={product?.productdata?.category?.name}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <CustomInput
                                        type="text"
                                        control={control}
                                        error={errors[`quantity[${index}]`]}
                                        fieldName={`quantity[${index}]`}
                                        placeholder={``}
                                        fieldLabel="Quantity"
                                        disabled={false}
                                        view={view ? true : false}
                                        defaultValue={product?.quantity}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    
                ))}
            </CustomBox>
          

        </Box>
    )
}

export default AbandonedForm