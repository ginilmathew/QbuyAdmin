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
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';

type props = {
    resData?: any,
    view?: any
}


const CustomerAccountForm = ({ resData, view }: props) => {
    console.log({resData},'ttt')
    const idd = resData ? resData : view;
    console.log({ idd }, 'ppppppp')
    const [customerData, setCustomerData] = useState<any>(null);
    console.log({ customerData }, 'llllllllllll')
    const router = useRouter()
    const [loading, setLoading] = useState(false);



    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue, } = useForm<any>({

            defaultValues: {
                customer_name: '',
                customer_phone: '',
                customer_email: '',

            }
        });

    const columns: GridColDef[] = [
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'created_at ',
            headerName: 'Ordered Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.created_at ,"YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
        },
        {
            field: 'grand_total',
            headerName: 'Order Total',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'delivered_date',
            headerName: 'Ordered Completed Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.delivered_date ,"YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")

        },

    ];
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const customerCart = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/account/customers/show/${idd}`);
    
            console.log('Customer Data:', response?.data?.data); 
            reset(response?.data?.data);
            setCustomerData(response?.data?.data?.total_orders);
        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idd) {
            customerCart();
        }
    }, [idd]);


    return (
        <Box>

            <CustomBox title="Customer Details">
                <Grid container flex={0.7} spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.customer_name}
                            fieldName="customer_name"
                            placeholder={``}
                            fieldLabel="Rider Name"
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={customerData?.data?.customer_name}
                        />
                    </Grid>
                   

                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.customer_email}
                            fieldName="customer_email"
                            placeholder={``}
                            fieldLabel="Email Address"
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={customerData?.data?.customer_email}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type="number"
                            control={control}
                            error={errors.customer_phone}
                            fieldName="customer_phone"
                            placeholder={``}
                            fieldLabel="Mobile Number"
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={customerData?.data?.customer_phone}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Order Log'>
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={customerData ? customerData : []} id={'_id'} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>

        </Box>
    )
}

export default CustomerAccountForm