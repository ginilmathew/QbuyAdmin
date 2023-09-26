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


type props = {
    resData?: any,
    view?: any
}


const AbandonedForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [abandonedData, setAbandonedData] = useState<any>([]);
    console.log({ abandonedData }, 'hai')
    const [searchList, setSearchList] = useState([]);
    const customerName = resData?.data?.user?.name || '';
    const mobileNumber = resData?.data?.user?.mobile || '';
    const emailAddress = resData?.data?.user?.email || '';
    const dateViewed = resData?.data?.updated_at || '';



    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue, } = useForm<any>({

            defaultValues: {
                name: '',
                mobile: '',
                email: '',
                created: '',
                store_address: '',
                quantity: '',
                names:'',
                store:'',

            }
        });

    const abandonedCart = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/abandoned/show/${idd}`);
       
            setAbandonedData(response?.data?.data);
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (idd) {
            abandonedCart()
        }
    }, [idd])

    useEffect(() => {
        if (abandonedData && abandonedData.product_details && abandonedData.product_details.length > 0) {

            setValue('name', abandonedData?.user?.name)
            setValue('mobile', abandonedData?.user?.mobile)
            setValue('email', abandonedData?.user?.email)
            setValue('created', abandonedData?.user?.created_at)
            setValue('names', abandonedData?.product_details[0]?.name);
            setValue('store', abandonedData?.product_details[0]?.productdata?.store?.name);
            setValue('quantity', abandonedData?.product_details[0]?.quantity);
        }
    }, [abandonedData]);

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
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.created}
                            fieldName="created"
                            placeholder={``}
                            fieldLabel={"Date Viewed"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={abandonedData ? moment(abandonedData?.user?.created_at).format('DD/MM/YYYY') : ''}
                        />
                    </Grid>


                </Grid>
            </CustomBox>
            <CustomBox title='Abandoned Details'>
            {abandonedData && abandonedData.product_details && (
                    <Box display={'flex'} flexDirection="column">
                        {abandonedData.product_details.map((product:any, index:number) => (
                            // <Grid container flex={.7} spacing={2}>
                            //     <Grid item xs={12} lg={3}>
                            //         <Typography>Product Image</Typography>
                            //         {abandonedData && abandonedData.product_details && abandonedData.product_details.length > 0 ? (
                            //             <Avatar
                            //                 variant='square'
                            //                 src={`${IMAGE_URL}${abandonedData.product_details[0]?.image}`}
                            //                 sx={{ width: '93%', height: 130 }}
                            //             />
                            //         ) : (
                            //             <div style={{ width: '100%', height: 130, backgroundColor: 'lightgray' }}></div>
                            //         )}
                            //     </Grid>
                            <Grid container flex={.7} spacing={2} key={index}>
                            <Grid item xs={12} lg={3}>
                                <Typography>Product Image</Typography>
                                {product && product.image ? (
                                    <Avatar
                                        variant='square'
                                        src={`${IMAGE_URL}${product.image}`}
                                        sx={{ width: '93%', height: 130 }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: 130, backgroundColor: 'lightgray' }}></div>
                                )}
                            </Grid>
                                <Grid container flex={0.9} spacing={2} sx={{ paddingTop: '22px' }}>
                                    <Grid item xs={12} lg={3}>
                                        <CustomInput
                                            type='text'
                                            control={control}
                                            error={errors.names}
                                            fieldName="names"
                                            placeholder={``}
                                            fieldLabel={"Product Name"}
                                            disabled={false}
                                            view={view ? true : false}

                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3}>
                                        <CustomInput
                                            type='text'
                                            control={control}
                                            error={errors.store}
                                            fieldName="store"
                                            placeholder={``}
                                            fieldLabel={"Store Name"}
                                            disabled={false}
                                            view={view ? true : false}
                                        />
                                    </Grid>

                                    <Grid item xs={12} lg={3}>
                                        <CustomInput
                                            type='text'
                                            control={control}
                                            error={errors.category}
                                            fieldName="category"
                                            placeholder={``}
                                            fieldLabel={"Category"}
                                            disabled={false}
                                            view={view ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3}>
                                        <CustomInput
                                            type='text'
                                            control={control}
                                            error={errors.quantity}
                                            fieldName="quantity"
                                            placeholder={``}
                                            fieldLabel={"Quantity"}
                                            disabled={false}
                                            view={view ? true : false}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>))}
                    </Box>
                )}
            </CustomBox>
        </Box>
    )
}

export default AbandonedForm