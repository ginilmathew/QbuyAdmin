import { Router, useRouter } from 'next/router'
import React, { useState, useTransition, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';

const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });

import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';
import moment from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';
import useSWR from 'swr'


const fetcher = (url: any) => fetchData(url).then((res) => res);

const Shipments = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [shippingList, setShippingList] = useState<any>([])
    const [pending, startTransition] = useTransition();
    const [serachList, setSearchList] = useState<any>([]);



    const { data, error, isLoading } = useSWR(`admin/orders/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);

    useEffect(() => {
        if (data?.data?.data) {
            setShippingList(data?.data?.data)
        }
    }, [data?.data?.data])

    const ShippmentView = (id: string) => {
        router.push(`/shipments/view/${id}`)
    }

    const ShippmentEdit = (id: string) => {
        router.push(`/shipments/edit/${id}`)
    }



    const columns: GridColDef[] = [
        {
            field: 'order_id',
            headerName: 'Order ID',
            headerAlign: 'center',
            align: 'center',
            width: matches ? 180 : 200,
        },
        {
            field: 'Date & Time',
            headerName: 'Date & Time',
            width: matches ? 180 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY hh:mm A')),

        },
        {
            field: 'Customer Name ',
            headerName: 'Customer Name',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.name ? params.row.user?.name : '-'

        },
        {
            field: 'grand_total',
            headerName: 'Order Total',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.grand_total?.toFixed(2)
        },

        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.franchisee?.franchise_name ? params.row.franchisee?.franchise_name : '-'
        },

        {
            field: 'delivery_type',
            headerName: 'Order Type',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'mobile',
            headerName: 'Mobile',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.mobile ? params.row.user?.mobile : '-'

        },


        {
            field: 'payment_status',
            headerName: 'payment Status',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'payment_type',
            headerName: 'payment Method',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'status',
            headerName: 'Status',
            width: matches ? 150 : 200,
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
                        onClick={() => ShippmentView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                    {(!['completed', 'cancelled'].includes(row?.status)) &&
                        <BorderColorTwoToneIcon
                            onClick={() => ShippmentEdit(row?._id)}
                            style={{
                                color: '#58D36E',
                                cursor: 'pointer'
                            }}
                        />}
                    {/* <DeleteOutlineTwoToneIcon

                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />  */}
                </Stack>
            )
        }
    ];


    // const searchProducts = useCallback((value: any) => {
    //     let competitiions = data?.data?.data?.filter((com: any) => com?.order_id.toString().toLowerCase().includes(value.toLowerCase())
    //         || com?.user?.mobile.toString().toLowerCase().includes(value.toLowerCase()) ||
    //         com?.franchisee?.franchise_name.toString().toLowerCase().includes(value.toLowerCase())
    //     )
    //     startTransition(() => {
    //         setShippingList(competitiions)
    //     })
    // }, [shippingList])
    
    const searchProducts = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => 
            (com?.order_id?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
            com?.user?.mobile?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
            com?.user?.name?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
            com?.franchisee?.franchise_name?.toString()?.toLowerCase().includes(value.toLowerCase()))
        );
        startTransition(() => {
            setShippingList(competitiions);
        });
    }, [shippingList]);
    
    
    
    

    // const ShippingOrders = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await fetchData(`admin/orders/${process.env.NEXT_PUBLIC_TYPE}`)
    //         setShippingList(response?.data?.data)
    //         setSearchList(response?.data?.data)
    //     } catch (err: any) {
    //         toast.error(err.message)
    //         setLoading(false)

    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     ShippingOrders()
    // }, [])

    const addOrderShipmets = () => {
        router.push('/shipments/addOrder')
    }


    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader imprtlabel={'Export'} setState={searchProducts} imprtBtn={false} Headerlabel='Orders' onClick={addOrderShipmets} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} id={"id"} bg={"#ffff"} loading={true} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    }


  if(error){
    toast.error(error?.message)
  }

    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader imprtlabel={'Export'} setState={searchProducts} imprtBtn={false} Headerlabel='Orders' onClick={addOrderShipmets} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={shippingList ? shippingList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    )
}

export default Shipments
