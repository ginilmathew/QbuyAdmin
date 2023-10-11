import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { Box, Typography, Stack } from '@mui/material'
import React, { startTransition, useCallback, useState, useEffect } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import moment from 'moment';
import CustomDelete from '@/Widgets/CustomDelete';


const Customer = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [categoryList, setCategoryList] = useState([]);


    const columns: GridColDef[] = [
        {
            field: 'customer_id',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'franchise_name',
            headerName: 'Customer Name',
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
            valueGetter: (params) => params?.row?.users?.mobile,
        },
        {
            field: 'owner_namsse',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const row = []

    const searchProducts = useCallback((value: any) => {
        let filteredData = searchList?.filter((item: any) => {
            const userIdMatch = item?.customer_id.toString().toLowerCase().includes(value.toLowerCase());
            const mobileMatch = item?.users?.mobile.toString().toLowerCase().includes(value.toLowerCase());
            return userIdMatch || mobileMatch;
        });
        setCustomerData(filteredData);
    }, [searchList, customerData]);


    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/customer-details/list`);
            console.log(response?.data?.data);
            setCustomerData(response?.data?.data);
            setSearchList(response?.data?.data)

        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomerData()
    }, [])

   

    const NavigateToaddCustomer = useCallback(() => {
        router.push('/customerDetails/addCustomer')

    }, []);

    const editCustomer = (id: any) => {
        router.push(`/customerDetails/edit/${id}`)
    }
    const viewCustomer = (id: any) => {
        router.push(`/customerDetails/view/${id}`)
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