import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment'
import { fetchData } from '@/CustomAxios';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { toast } from 'react-toastify';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });


const fetcher = (url: any) => fetchData(url).then((res) => res);
const OTP_View = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/otp-view`, fetcher);

    const [loading, setLoading] = useState(false);
    const [otpData, setOtpData] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setOtpData(data?.data?.data)
        }
    }, [data?.data?.data])


    const columns: GridColDef[] = [
        {
            field: 'user_id',
            headerName: 'ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Mobile',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'SMS Gateway',
            headerName: 'SMS Gateway',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'Issue',
            headerName: 'Issue',
            flex: 1,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'Date & Time',
            headerName: 'Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params?.row?.updated_at).format('DD/MM/YYYY hh:mm A')),

        },

        {
            field: 'loginotp',
            headerName: 'OTP',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

    ];

    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            com?.user_id.toString().includes(value) ||
            com?.mobile.toString().includes(value)
        );

        startTransition(() => {
            setOtpData(Results);
        });
    }, [otpData]);

    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='OTP View' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} loading={true} rows={[]} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    }
    if (error) {
        toast.error(error?.message);
    }
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='OTP View' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={otpData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>

    )
}

export default OTP_View
