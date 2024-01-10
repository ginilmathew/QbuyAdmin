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
import CutomSearch from '@/components/CutomSearch';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);
const customerComplaints = () => {


    const [tab, settabs] = useState('all')
    const { data, error, isLoading, mutate } = useSWR(`admin/customer-complaints/${tab}`, fetcher);

    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [customerComplaint, setCustomerComplaint] = useState([]);
    const [background, setBackground] = useState('All');
    const [listCount, setListCount] = useState([{
        name: 'All',
        count: null,
        key: false
    },
    {
        name: 'Processing',
        count: 0,
        key: true
    },
    {
        name: 'Picked',
        count: 0,
        key: true
    },
    {
        name: 'Resolved', count: 0,
        key: true
    }])


    const [searchList, setSearchList] = useState([]);
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');

    useEffect(() => {
        if (data?.data?.data?.complaint) {
            setCustomerComplaint(data.data.data.complaint);
            listCount[1].count = data?.data?.processing_count
            listCount[2].count = data?.data?.picked_count
            listCount[3].count = data?.data?.resolved_count

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
            field: 'Created Date',
            headerName: 'Created Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            type: 'date',
            valueGetter: (params) => new Date(params.row.created_at),
        },
        {
            field: 'complaint_id',
            headerName: 'Ticket ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'customer_name',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.user?.name,
        },
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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
            valueGetter: (params) => params?.row?.admin?.name,

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

                </Stack>
            )
        }
    ];

    const rows = [];
    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.complaint.filter((com: any) => com?.complaint_id?.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.order_id?.toString().toLowerCase().includes(value.toLowerCase()) || com?.status?.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setCustomerComplaint(competitiions)
        })
    }, [customerComplaint])


    class Changetab {
        static changetab(value: any) {
            if (value === 'All') return settabs('all')
            else if (value === 'Processing') return settabs('processing')
            else if (value === 'Picked') return settabs('picked')
            else return settabs('resolved')

        }
    }

    const handleButtonClick = (value: any) => {
        setBackground(value)
        Changetab.changetab(value)
    }






    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={null} addbtn={false} imprtBtn={false} Headerlabel='Customer Complaint' onClick={() => null} />
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography fontSize={30} fontWeight={'bold'} color="#58D36E" letterSpacing={1} sx={{ fontFamily: `'Poppins' sans-serif`, }}>{'Customer Complaints'}</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {listCount.map((res: any) => (
                            <Box width={150} sx={{ position: 'relative', cursor: 'pointer', }} onClick={() => handleButtonClick(res?.name)}>

                                {res?.key && <Box sx={{ position: 'absolute', right: -5, top: -10, background: 'red', p: .5, borderRadius: 25, minWidth: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                    <Typography fontSize={12} fontWeight={'bold'} color="#fff" letterSpacing={1} sx={{ fontFamily: `'Poppins' sans-serif`, }} >10</Typography>
                                </Box>}
                                <Box sx={{ background: background === res?.name ? '#f5f5f5' : '', px: 1, py: 1.5, borderRadius: 3, justifyContent: 'center', alignItems: 'center', border: '1px solid #58D36E', display: 'flex' }}>
                                    <Typography fontSize={14} fontWeight={'bold'} color="#000" letterSpacing={1} sx={{ fontFamily: `'Poppins' sans-serif`, }}>{res?.name}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box>
                        <CutomSearch setState={searchItem} />
                    </Box>
                </Box>
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={customerComplaint} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

        </Box>
    )
}

export default customerComplaints