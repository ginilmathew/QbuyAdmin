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
const Customer = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/customer-details/list`, fetcher);
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [categoryList, setCategoryList] = useState([]);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setCustomerData(data?.data?.data)
        }
    }, [data?.data?.data])


    const NavigateToaddCustomer = useCallback(() => {
        router.push('/customerDetails/addCustomer')

    }, []);

    const editCustomer = (id: any) => {
        router.push(`/customerDetails/edit/${id}`)
    }
    const viewCustomer = (id: any) => {
        router.push(`/customerDetails/view/${id}`)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    
    const columns: GridColDef[] = [
        {
            field: 'customer_id',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.users?.name,

        },
        {
            field: 'mobile',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.users?.mobile,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.users?.email,

        },
        {
            field: 'created_at',
            headerName: 'Date Added',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params?.row?.created_at).format('DD/MM/YYYY hh:mm A')),
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Typography
                    sx={{ fontFamily: `'Poppins' sans-serif`, fontSize: 14, color: '#939393' }}
                >{row?.status}</Typography>)

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
                        onClick={() => viewCustomer(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => editCustomer(row?._id)}
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

    const row = []

    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            com?.customer_id.toString().includes(value) ||
            com?.users?.mobile.toString().includes(value)
        );

        startTransition(() => {
            setCustomerData(Results);
        });
    }, [customerData]);


    if (isLoading) {

        <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
            <CustomTableHeader setState={searchProducts} addbtn={true} imprtBtn={false} Headerlabel='Customer' onClick={NavigateToaddCustomer} />
            <Box py={3}>
                <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={'id'} bg={"#ffff"} label='Recent Activity' />
            </Box>
        </Box>
    }
    if (error) {
        toast.error(error?.message);
    }

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} addbtn={true} imprtBtn={false} Headerlabel='Customer' onClick={NavigateToaddCustomer} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={customerData} id={'customer_id'} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Category'
                paragraph='category'
                _id={_id}
                setData={setCustomerData}
                data={categoryList}
                url={`/admin/customer-details/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default Customer