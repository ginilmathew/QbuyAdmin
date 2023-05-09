import { Router, useRouter } from 'next/router'
import React, { useState, useTransition, useEffect, useCallback } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';
import moment from 'moment';

const Shipments = () => {
    const router = useRouter()


    const [loading, setLoading] = useState<boolean>(false);
    const [shippingList, setShippingList] = useState<any>([])
    const [pending, startTransition] = useTransition();
    const [serachList, setSearchList] = useState<any>([])

    const ShippmentView = (id: string) => {
        router.push(`/shipments/view/${id}`)
    }


    const columns: GridColDef[] = [
        {
            field: 'order_id', headerName: 'Order ID', flex: 1, headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Date & Time',
            headerName: 'Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY hh:mm A')),

        },
        {
            field: 'Customer Name ',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'grand_total',
            headerName: 'Order Total',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Store',
            headerName: 'Store',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.franchisee?.franchise_name ? params.row.franchisee?.franchise_name : '-'
        },

        {
            field: 'delivery_type',
            headerName: 'Order Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },


        {
            field: 'payment_status',
            headerName: 'payment Status',
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
                    {/* <BorderColorTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon

                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} /> */}
                </Stack>
            )
        }
    ];


    const searchProducts = useCallback((value: any) => {
        let competitiions = serachList?.filter((com: any) => com?.order_id.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setShippingList(competitiions)
        })
    }, [shippingList])

    const ShippingOrders = async () => {

        try {
            setLoading(true)
            const response = await fetchData(`admin/orders/${process.env.NEXT_PUBLIC_TYPE}`)
            setShippingList(response?.data?.data)
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        ShippingOrders()
    }, [])

    const addOrderShipmets = () => {
        router.push('/shipments/addOrder')
    }


    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader imprtlabel={'Export'} setState={searchProducts} imprtBtn={false} Headerlabel='Orders' onClick={addOrderShipmets} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={shippingList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    )
}

export default Shipments
