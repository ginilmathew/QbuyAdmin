import { Box } from '@mui/material'
import CustomLoader from '@/components/CustomLoader';
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import Custombutton from '@/components/Custombutton';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { fetchData, postData } from '@/CustomAxios';
import dynamic from 'next/dynamic';
import CustomDatePicker from '@/components/CustomDatePicker';
import { useForm, SubmitHandler, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
// const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });
const fetcher = (url: any) => fetchData(url).then((res) => res);
type props = {
    res?: any,
    view?: any
}

const Payout = ({ res, view }: props) => {
    console.log({ res })
    const idd = res ? res : view;
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/payout/${res}`, fetcher);
    const [payoutData, setPayoutData] = useState([]);
    const [pending, startTransition] = useTransition();
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const commonDateLabel = 'Date Filter';
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            fromDate: null,
            toDate: null,
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.date, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
        },
        {
            field: 'total_sales',
            headerName: 'Total Delivery',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'total_sales_amount',
            headerName: 'Amount Earned',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'deduction',
            headerName: 'Deduction Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'payout',
            headerName: 'Payout',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
    ];

    useEffect(() => {
        if (data?.data?.data) {
            setPayoutData(data?.data?.data);
            console.log("shipment Data:", data?.data?.data);
        }
    }, [data?.data?.data]);


    useEffect(() => {
        if (fromDate && toDate) {
            fetchFilteredData();
        }
    }, [fromDate, toDate]);

    
    const fetchFilteredData = async () => {
        const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
        const formattedToDate = moment(toDate).format('YYYY-MM-DD');
        const payload = {
            rider_id: idd,
            from_date: formattedFromDate,
            to_date: formattedToDate,
        };
        try {
            mutate(undefined, true);
            const response = await postData('admin/rider-support/payout/list', payload);
            setPayoutData(response.data.data);
        } catch (error) {
            toast.error('Failed to filter data.');
        }finally {
            mutate(undefined, false);
        }
    };


    return (

        <Box px={0} py={1} pt={0} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" mt={3}>
                    <div >
                        <CustomDatePicker
                            fieldName='fromDate'
                            control={control}
                            error={''}
                            fieldLabel={commonDateLabel}
                            values={fromDate}
                            changeValue={(date) => setFromDate(date)}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <CustomDatePicker
                            fieldName='toDate'
                            control={control}
                            error={''}
                            fieldLabel={''}
                            values={toDate}
                            changeValue={(date) => setToDate(date)}
                        />
                    </div>
                </Stack>
{/* 
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={payoutData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box> */}
                <Box py={5}>
                    {isLoading ? (
                        <CustomLoader />
                    ) : (
                        <CustomTable dashboard={false} columns={columns} rows={payoutData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                    )}
                </Box>
            </Box>
        </Box>
    )
}
export default Payout