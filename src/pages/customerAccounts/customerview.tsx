import { Avatar, Box, Grid, MenuItem, Typography, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
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
import CustomerLogsModal from '@/pages/customerAccounts/Customerlog'

type props = {
    resData?: any,
    view?: any
}
export interface SimpleDialogProps {
    open: boolean;
    id: string | null;
    date: any;
    onClose: any;
}


const CustomerAccountForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;
    const [customerData, setCustomerData] = useState<any>(null);
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [productViewed, setProductViewed] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openLog, setOpenLog] = useState<boolean>(false)
    const [orderIdSelect, setOrderIdSelect] = useState<string | null>(null);


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


        const OpenLogModal = useCallback((orderId: string) => {
            console.log('OpenLogModal called with orderId:', orderId);
            setOrderIdSelect(orderId);
            setOpenLog(true);
        }, []);
        

    const columns: GridColDef[] = [
    
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <Typography
                        onClick={() => OpenLogModal(params.row._id)}
                        style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#58D36E'
                        }}>
                        {params.value}
                    </Typography>
                </Stack>
            )
        },

        {
            field: 'created_at ',
            headerName: 'Ordered Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.created_at, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
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
            valueGetter: (params) => moment(params?.row?.delivered_date, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")

        },

    ];
    const columns2: GridColDef[] = [
        {
            field: 'product_name',
            headerName: 'Product Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Store Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.store_details?.name,
        },
        {
            field: 'viewed_date',
            headerName: 'Date Viewed',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.viewed_date, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
        },


    ];



    const customerCart = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/account/customers/show/${idd}`);
            console.log({ response }, 'responsedataview')
            reset(response?.data?.data);
            setCustomerData(response?.data?.data?.total_orders);
            setProductViewed(response?.data?.data?.product_viewd);
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

                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Order Log'>
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={customerData ? customerData : []} id={'_id'} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>
            <CustomBox title='Products Viewed Report'>
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns2} rows={productViewed} id={'index'} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>
            {openLog && (
                <CustomerLogsModal
                onClose={() => setOpenLog(false)}
                open={openLog}
                order_id={orderIdSelect} 
                isReadOnly={true}
            />
            
            )}
        </Box>
    )
}

export default CustomerAccountForm