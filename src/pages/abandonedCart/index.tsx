
import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });


const fetcher = (url: any) => fetchData(url).then((res) => res);

const AbandonedCart = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/abandoned/list`, fetcher);
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [pending, startTransition] = useTransition();


    useEffect(() => {
        if (data?.data?.data) {
            setCartData(data?.data?.data)
        }
    }, [data?.data?.data])

    const abandonedCartView = (id: string) => {
        router.push(`/abandonedCart/view/${id}`)
    }


    const columns: GridColDef[] = [
        {
            field: 'user_id',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.user_id || '',
        },
        {
            field: 'name',
            headerName: 'Customer',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.name || '',
        },

        {
            field: 'mobile',
            headerName: 'Mobile',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.mobile || '',
        },
        {
            field: 'created_at',
            headerName: 'Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY hh:mm A')),
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                        onClick={() => abandonedCartView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
    ];


    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            com?.user?.user_id.toString().includes(value) ||
            com?.user?.mobile.toString().includes(value)
        );

        startTransition(() => {
            setCartData(Results);
        });
    }, [cartData]);

    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} setState={searchProducts} Headerlabel='Abandoned Cart' onClick={abandonedCartView} />
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
                <CustomTableHeader addbtn={false} imprtBtn={false} setState={searchProducts} Headerlabel='Abandoned Cart' onClick={abandonedCartView} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={cartData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default AbandonedCart
