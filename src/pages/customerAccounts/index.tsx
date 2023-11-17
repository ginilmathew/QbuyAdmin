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
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);
const customerAccounts = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/account/customers/list`, fetcher);
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [customerAccountData, setCustomerAccountData] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setCustomerAccountData(data?.data?.data)
        }
    }, [data?.data?.data])

    const customeraccountView = (id: string) => {
        router.push(`/customerAccounts/view/${id}`);
    }
    

    const columns: GridColDef[] = [
        {
            field: 'customer_id',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'customer_name',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'customer_phone',
            headerName: 'Phone',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'total_order_count',
            headerName: 'Total Orders',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'total_order_amount',
            headerName: 'Total Order Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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
                        onClick={() => customeraccountView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
    ];

    const rows = [];


    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            com?.customer_id.toString().includes(value) ||
            com?.customer_phone.toString().includes(value)
        );

        startTransition(() => {
            setCustomerAccountData(Results);
        });
    }, [customerAccountData]);



  if(isLoading){
    <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Customer'  onClick={() => null} />
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
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Customer'  onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={customerAccountData} id={"customer_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default customerAccounts