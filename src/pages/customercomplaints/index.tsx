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
const customerComplaints = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/customer-complaints`, fetcher);
    console.log({data},'hai')
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [customerComplaint, setCustomerComplaint] = useState([]);

    console.log({customerComplaint},'hai')
    const [searchList, setSearchList] = useState([]);
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');

    useEffect(() => {
        if (data?.data?.data?.complaint) {
            setCustomerComplaint(data.data.data.complaint);
        }
    }, [data?.data?.data]);
    
   
  

    const customercomplaintView = (id: string) => {
        router.push(`/customercomplaints/view/${id}`);
    }
    const customercomplaintEdit = (id: any) => {
        router.push(`/customercomplaints/edit/${id}`)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const columns: GridColDef[] = [
        {
            field: 'complaint_id',
            headerName: 'Ticket ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.complaint_id,
        
        },
        {
            field: 'customer_name',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.order?.order_id,
        },

        {
            field: 'mobile',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.user?.mobile,

        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'total_order_amounts',
            headerName: 'Action Taken By',
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
                        onClick={() => customercomplaintView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => customercomplaintEdit(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen(row?._id)}
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
        let Results = data?.data?.data?.complaint?.filter((com: any) =>
            (com?.order_id?.toString() || '').includes(value) ||
            (com?.status?.toString().toLowerCase() || '').includes(value.toLowerCase()) ||
            (com?.mobile?.toString() || '').includes(value)
        );
    
        startTransition(() => {
            setCustomerComplaint(Results);
        });
    }, [customerComplaint]);
    
    
    



  if(isLoading){
    <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Customer Complaint'  onClick={() => null} />
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
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Customer Complaint'  onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={customerComplaint} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default customerComplaints