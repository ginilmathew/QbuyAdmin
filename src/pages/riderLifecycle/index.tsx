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
import RiderOnBoarding from '../riderOnboarding';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);


const RiderLifecyle = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-lifecycle`, fetcher);
    console.log({data},'hai')
    const router = useRouter()
    const [reactLifceCycleList, setreactLifceCycleList] = useState<any>([])
    const [Loading, setLoading] =useState<boolean>(false);
    const [serachList, setSearchList] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false)
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setreactLifceCycleList(data?.data?.data);
            console.log("lifecycle Data:", data?.data?.data); 
        }
    }, [data?.data?.data]);
    

    const RiderLifecycleView=(id:any)=>{
        router.push(`riderLifecycle/view/${id}`)
    }
    const RiderLifeCycleEdit =(id:any)=>{
        router.push(`riderLifecycle/edit/${id}`)
    }
    const columns: GridColDef[] = [
        { field: 'rider_id', headerName: 'Rider ID', flex: 1, },
        {
            field: 'name',
            headerName: 'Rider Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Contact',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        // {
        //     field: 'status',
        //     headerName: 'Status',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center',
        //     cellClassName: (params) => {
        //         const status = params.value as string;
        //         console.log(status);
                
        //         if (status === 'active' ||status === 'Active' ) {
        //             return 'active-status';
        //         } else if (status === 'Online') {
        //             return 'terminated-status';
        //         } else if (status === 'Pending') {
        //             return 'pending-status';
        //         }
        //         return ''; 
        //     },
          
        // },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
              if (Array.isArray(params.row.rider_life_cycle_log) && params.row.rider_life_cycle_log.length > 0) {
                const lastLog = params.row.rider_life_cycle_log[params.row.rider_life_cycle_log.length - 1];
                return lastLog.status || '';
              }
              return '';
            },
        },
        {
            field: 'reason',
            headerName: 'Reason',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
              if (Array.isArray(params.row.rider_life_cycle_log) && params.row.rider_life_cycle_log.length > 0) {
                const lastLog = params.row.rider_life_cycle_log[params.row.rider_life_cycle_log.length - 1];
                return lastLog.reason || '';
              }
              return '';
            },
          },
          
          {
            field: 'change',
            headerName: 'Changed By',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
              if (Array.isArray(params.row.rider_life_cycle_log) && params.row.rider_life_cycle_log.length > 0) {
                const lastLog = params.row.rider_life_cycle_log[params.row.rider_life_cycle_log.length - 1];
                return lastLog.users?.name || '';
              }
              return '';
            },
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
                         onClick={()=>RiderLifecycleView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                    onClick={()=>RiderLifeCycleEdit(row?._id)}

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
        let results = data?.data?.data?.filter((com: any) =>
        com?.rider_id.toString() === value ||
            com?.mobile.toString().includes(value) ||
            com?.name.toString().toLowerCase().includes(value.toLowerCase()) 
        );

        startTransition(() => {
            setreactLifceCycleList(results);
        });
    }, [data?.data?.data, startTransition]);
    

    if(isLoading){
        <Box px={5} py={2} pt={10} mt={0}>
                <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                    <CustomTableHeader  addbtn={false} imprtBtn={false} Headerlabel='Rider Lifecycle'  onClick={null} />
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
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='Rider Lifecycle' onClick={null} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={reactLifceCycleList ? reactLifceCycleList:[]} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    )
}

export default RiderLifecyle
