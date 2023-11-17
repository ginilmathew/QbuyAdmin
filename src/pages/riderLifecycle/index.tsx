import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';



const RiderLifecyle = () => {
    const router = useRouter()
    const [reactLifceCycleList, setreactLifceCycleList] = useState<any>([])
    const [Loading, setLoading] =useState<boolean>(false);
    const [serachList, setSearchList] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false)

    // const RiderLifecycleView=(id:any)=>{
    //     router.push(`riderLifecycle/view`)
    // }
    // const RiderLifeCycleEdit =(id:any)=>{

    // }
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
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            cellClassName: (params) => {
                const status = params.value as string;
                console.log(status);
                
                if (status === 'active' ||status === 'Active' ) {
                    return 'active-status';
                } else if (status === 'Online') {
                    return 'terminated-status';
                } else if (status === 'Pending') {
                    return 'pending-status';
                }
                return ''; 
            },
          
        },
        {
            field: 'Reason',
            headerName: 'Reason',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Changed By',
            headerName: 'Changed By',
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
                        // onClick={()=>RiderLifecycleView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                    // onClick={()=>RiderLifeCycleEdit(row?._id)}

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    
                </Stack>
            )
        }
    ];
    const reactLifecycle = async()=>{
    

            try {
                setLoading(true)
                const response = await fetchData(`admin/rider-lifecycle`)
                console.log(response);
                setreactLifceCycleList (response?.data?.data)
                setSearchList(response?.data?.data)
            } catch (err: any) {
                toast.error(err.message)
                setLoading(false)
    
            } finally {
                setLoading(false)
            }
        
    
    }

  useEffect(() => {
   reactLifecycle()
  }, [])
  
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader imprtBtn={false} Headerlabel='Rider Lifecycle' onClick={null} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={reactLifceCycleList ? reactLifceCycleList:[]} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    )
}

export default RiderLifecyle
