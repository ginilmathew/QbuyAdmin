
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

const RiderSupport = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/list`, fetcher);
    const router = useRouter()
    const [ridersupportData, setRiderSupportData] = useState([]);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setRiderSupportData(data?.data?.data);
            console.log("RiderSupport Data:", data?.data?.data);
        }
    }, [data?.data?.data]);

    // const editRiderSupport = (id: any) => {
    //     router.push(`/riderSupport/edit/${id}`)
    // }
   
    
    // const viewRiderSupport = (id: any) => {
    //     router.push(`/riderSupport/view/${id}`)
    // }
    const editRiderSupport = (id:any, rider_id:any) => {
        sessionStorage.setItem('rider_id', rider_id); 
        router.push(`/riderSupport/edit/${id}`);
    };
    
    const viewRiderSupport = (id:any, rider_id:any) => {
        sessionStorage.setItem('rider_id', rider_id);
        router.push(`/riderSupport/view/${id}`);
    };
    
    
    const columns: GridColDef[] = [
        { field: 'rider_id', headerName: 'Rider ID', flex: 1, valueGetter: (params) => `#${params.row.rider_id || ''}`, },
        {
            field: 'name',
            headerName: 'Rider Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'franchise_name',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.primary_franchise?.franchise_name,

        },
        {
            field: 'city',
            headerName: 'City',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'online_status',
            headerName: 'status',
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
                        //onClick={() => viewRiderSupport(row?._id)}
                        onClick={() => viewRiderSupport(row?._id, row?.rider_id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                       // onClick={() => editRiderSupport(row?._id)}
                       onClick={() => editRiderSupport(row?._id, row?.rider_id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />

                </Stack>
            )
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
            setRiderSupportData(Results);
        });
    }, [ridersupportData]);


    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Riders' onClick={() => null} />
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
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='Rider Support' onClick={null} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={ridersupportData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    )
}

export default RiderSupport
