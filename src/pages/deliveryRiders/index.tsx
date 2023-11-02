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

const DeliveryRiders = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/delivery-riders/list`, fetcher);
    const [deliveryriderData, setDeliveryRiderData] = useState([]);

    useEffect(() => {
        if (data?.data?.data) {
            setDeliveryRiderData(data?.data?.data);
            console.log("RiderData:", data?.data?.data); 
        }
    }, [data?.data?.data]);
    
    const columns: GridColDef[] = [
        {
            field: 'rider_attendance_id',
            headerName: 'Rider ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Rider Name',
            headerName: 'Rider Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Contact No.',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'Franchise',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'City',
            headerName: 'City',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Logout',
            headerName: 'Logout',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
       
    ];

    
  if(isLoading){
    <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader  addbtn={false} imprtBtn={false} Headerlabel='Riders'  onClick={() => null} />
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
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Riders' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={deliveryriderData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default DeliveryRiders
