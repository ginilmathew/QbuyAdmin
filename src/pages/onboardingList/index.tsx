
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

const OnBoardingList = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/onboarding/list`, fetcher);
    const router = useRouter()
    const [riderData, setRiderData] = useState([]);
    const [pending, startTransition] = useTransition();
  

    useEffect(() => {
        if (data?.data?.data) {
            setRiderData(data?.data?.data);
            console.log("Rider Data:", data?.data?.data); 
        }
    }, [data?.data?.data]);
    
    const editRider = (id: any) => {
        router.push(`/onboardingList/edit/${id}`)
    }
    const viewRider = (id: any) => {
        router.push(`/onboardingList/view/${id}`)
    }

    const columns: GridColDef[] = [
        { field: 'rider_id', headerName: 'Rider ID', flex: 1 },
        {
            field: 'name',
            headerName: 'Rider Name',
            flex: 1,
        },
        {
            field: 'mobile',
            headerName: 'Contact No.',
            flex: 1,
        },
        {
            field: 'franchise_name',
            headerName: 'Franchise',
            flex: 1,
            valueGetter: (params) => params?.row?.primary_franchise?.franchise_name,
        },
        {
            field: 'city',
            headerName: 'City',
            flex: 1,
        },
        {
            field: 'pan_card_number',
            headerName: 'PAN',
            flex: 1,
            valueGetter: (params) => params?.row?.kyc_details?.pan_card_number, 
        },
        
        {
            field: 'vehicle_number',
            headerName: 'Vehicle No.',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Onboarding status',
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
                    onClick={() => viewRider(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <BorderColorTwoToneIcon
                            onClick={() => editRider(row?._id)}
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
            com?.mobile.toString().includes(value) 
        );

        startTransition(() => {
            setRiderData(Results);
        });
    }, [riderData]);


    
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
                <CustomTableHeader setState={searchProducts}  imprtBtn={false} Headerlabel='Riders' onClick={() => null} addbtn={true} />
                <Box py={5}>
                <CustomTable dashboard={false} columns={columns} rows={riderData} id={"_id"} bg={"#ffff"} label='Recent Activity' />

                </Box>
            </Box>
        </Box>
    )
}

export default OnBoardingList
