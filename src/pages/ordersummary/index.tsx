
import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);

const ordersummarylist = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/order-summary`, fetcher);
    const router = useRouter()
    const [summaryData, setSummaryData] = useState([]);
    const [pending, startTransition] = useTransition();
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [searchList, setSearchList] = useState([]);


    useEffect(() => {
        if (data?.data?.data) {
            setSummaryData(data?.data?.data);
        }
    }, [data?.data?.data]);


    const viewOrder = (id: any) => {
        router.push(`/ordersummary/view/${id}`)
    }


    const columns: GridColDef[] = [

        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,

        },
        {
            field: 'rider_name',
            headerName: 'Rider Name',
            flex: 1,
        },
        {
            field: 'rider_mobile',
            headerName: 'Rider Phone',
            flex: 1,
        },
        {
            field: 'created_at',
            headerName: 'Order Placed On',
            flex: 1,
            valueGetter: (params) => moment(params?.row?.created_at).format("DD-MM-YYYY hh:mm A")
        },
        {
            field: 'store_accepted',
            headerName: 'Store Accepted On',
            flex: 1,
            valueGetter: (params) =>
                params?.row?.store_accepted
                    ? moment(params?.row?.store_accepted).format("hh:mm A")
                    : "",
        },
    
        {
            field: 'picked_up',
            headerName: 'Pickup Time ',
            flex: 1,
            valueGetter: (params) =>
                params?.row?.picked_up
                    ? moment(params?.row?.picked_up).format("hh:mm A")
                    : "",
        },
        {
            field: 'dropp_off',
            headerName: 'Reached Dropoff ',
            flex: 1,
            valueGetter: (params) =>
                params?.row?.dropp_off
                    ? moment(params?.row?.dropp_off).format("hh:mm A")
                    : "",
        },
        {
            field: 'delivery_time',
            headerName: 'Delivery Time ',
            flex: 1,
            valueGetter: (params) =>
                params?.row?.delivery_time
                    ? moment(params?.row?.delivery_time).format("hh:mm A")
                    : "",
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,

        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            headerAlign: 'center',
            align: 'center',

            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                        onClick={() => viewOrder(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />

                </Stack>
            ),
        }
    ];

    
    const rows = [];

    
    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            (com?.order_id?.toString() || '').includes(value) ||
            (com?.rider_name?.toString().toLowerCase() || '').includes(value.toLowerCase()) ||
            (com?.rider_mobile?.toString() || '').includes(value)
            
        );
    
        startTransition(() => {
            setSummaryData(Results);
        });
    }, [summaryData]);

    
    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Orders Summary' onClick={[]} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
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
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='Orders Summary' onClick={[]} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={summaryData} id={"order_id"} bg={"#ffff"} label='Recent Activity' />

                </Box>
            </Box>

        </Box>
    )
}

export default ordersummarylist
