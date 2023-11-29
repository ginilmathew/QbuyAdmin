
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

const pushnotificationList = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/push-notification/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const router = useRouter()
    const [notificationData, setNotificationData] = useState([]);
    const [pending, startTransition] = useTransition();
  

    useEffect(() => {
        if (data?.data?.data) {
            setNotificationData(data?.data?.data);
            console.log("Notification Data:", data?.data?.data); 
        }
    }, [data?.data?.data]);

    const NavigateToaddCustomer = useCallback(() => {
        router.push('/pushnotification/addPush')

    }, []);
    
    const editNotification = (id: any) => {
        router.push(`/pushnotification/edit/${id}`)
    }
    const viewNotification = (id: any) => {
        router.push(`/pushnotification/view/${id}`)
    }

    const columns: GridColDef[] = [
        
        {
            field: 'Added Date',
            headerName: 'Added Date',
            flex: 1,
        },
        {
            field: 'mobile',
            headerName: 'Notification Title',
            flex: 1,
        },
        {
            field: 'franchise_name',
            headerName: 'Target App',
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
                    onClick={() => viewNotification(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <BorderColorTwoToneIcon
                            onClick={() => editNotification(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                </Stack>
            ),
        }
    ];
    
   
   
    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            com?.rider_id.toString().includes(value) ||
            com?.mobile.toString().includes(value) ||
            com?.name.toString().includes(value) ||
            com?.primary_franchise?.franchise_name?.toLowerCase().includes(value.toLowerCase())
        );
    
        startTransition(() => {
            setNotificationData(Results);
        });
    }, [notificationData]);
    
    

    
  if(isLoading){
    <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader  addbtn={false} imprtBtn={false} Headerlabel='Push Notifications'  onClick={NavigateToaddCustomer}/>
                <Box py={5}>
                    <CustomTable dashboard={false} columns={notificationData} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
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
                <CustomTableHeader setState={searchProducts}  imprtBtn={false} Headerlabel='Push Notifications'onClick={NavigateToaddCustomer} addbtn={true} />
                <Box py={5}>
                <CustomTable dashboard={false} columns={columns} rows={notificationData} id={"_id"} bg={"#ffff"} label='Recent Activity' />

                </Box>
            </Box>
        </Box>
    )
}

export default pushnotificationList
