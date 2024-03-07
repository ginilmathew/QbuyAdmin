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
const CustomTableHeaders = dynamic(() => import('@/Widgets/CustomTableHeaders'), { ssr: false });
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
const ShipmentSupport = ({ res, view }: props) => {


    const idd = res ? res : view;

    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/shipment/list/${res}`, fetcher);
    const [shippmentData, setShippmentData] = useState([]);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setShippmentData(data?.data?.data);
            console.log("shipment Data:", data?.data?.data);
        }
    }, [data?.data?.data]);


    const columns: GridColDef[] = [
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => `#FA${params?.row?.orders?.order_id}`,
        },
        {
            field: 'created_at',
            headerName: 'Ordered Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.delivery_date, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
            // valueGetter: (params) => moment(params?.row?.orders?.created_at, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
            
        },
        {
            field: 'grand_total',
            headerName: 'Order Total',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => parseFloat(params?.row?.orders?.grand_total).toFixed(2),
        },
        

        {
            field: 'rider_amount',
            headerName: 'Amount Earned',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'delivery_date',
            headerName: 'Completed Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.delivery_date).format('DD/MM/YYYY')),
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.orders?.status,
        },

    ];
    // const searchProducts = useCallback((value: any) => {
    //     let Results = data?.data?.data?.filter((com: any) =>
    //         com?.orders?.order_id.toString().includes(value) || com?.orders?.status.includes(value)
    //     );

    //     startTransition(() => {
    //         setShippmentData(Results);
    //     });
    // }, [shippmentData]);

    return (
        <Box px={0} py={1} pt={1} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                {/* <CustomTableHeaders addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='' onClick={() => null} /> */}
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={shippmentData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>

    )
}

export default ShipmentSupport