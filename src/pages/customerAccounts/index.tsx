import React, { startTransition, useCallback, useState, useEffect } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';


const customerAccounts = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [customerAccountData, setCustomerAccountData] = useState([]);
    console.log({customerAccountData})
    const [searchList, setSearchList] = useState([]);

    const columns: GridColDef[] = [
        {
            field: 'customer_id',
            headerName: 'Customer ID',
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
        },
        {
            field: 'customer_phone',
            headerName: 'Phone',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'total_order_count',
            headerName: 'Total Orders',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'total_order_amount',
            headerName: 'Total Order Amount',
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
                        onClick={() => customeraccountView(row?._id)}
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
        let filteredData = searchList?.filter((item: any) => {
            const userIdMatch = item?.customer_id.toString().toLowerCase().includes(value.toLowerCase());
            const mobileMatch = item?.customer_phone.toString().toLowerCase().includes(value.toLowerCase());
            return userIdMatch || mobileMatch;
        });
        setCustomerAccountData(filteredData);
    }, [searchList, customerAccountData]);


    const fetchCustomerAccountData = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/account/customers/list`);
            console.log(response?.data?.data);
            setCustomerAccountData(response?.data?.data);
            setSearchList(response?.data?.data)


        } catch (err: any) {
            toast.error(err.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomerAccountData()
    }, [])

    const customeraccountView = (id: string) => {
        console.log(`customer account view  ID: ${id}`);
        router.push(`/customerAccounts/view/${id}`);
    }
    
  
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Customer'  onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={customerAccountData} id={"customer_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default customerAccounts