import React, { startTransition, useCallback, useState,useEffect } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import moment from 'moment';

const AbandonedCart = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [searchList, setSearchList] = useState([]);
    
    const columns: GridColDef[] = [
        {
            field:'user_id',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.user_id || '',
        },
        {
            field: 'name',
            headerName: 'Customer',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.name || '',
        },

        {
            field: 'mobile',
            headerName: 'Mobile',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.mobile || '',
        },
        {
            field: 'created_at',
            headerName: 'Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY hh:mm A')),
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
                    onClick={() => abandonedCartView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
    ];
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const searchProducts = useCallback((value: any) => {
        let filteredData = searchList?.filter((item: any) => {
          const userIdMatch = item?.user?.user_id.toString().toLowerCase().includes(value.toLowerCase());
          const mobileMatch = item?.user?.mobile.toString().toLowerCase().includes(value.toLowerCase());
          return userIdMatch || mobileMatch;
        });
    
        setCartData(filteredData);
      }, [searchList]);
    
    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/abandoned/list`);
            console.log(response?.data?.data);
            setCartData(response?.data?.data); 
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const abandonedCartView = (id: string) => {
        router.push(`/abandonedCart/view/${id}`)
    }
  

  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} setState={searchProducts}  Headerlabel='Abandoned Cart' onClick={abandonedCartView} />
        <Box py={5}>
            <CustomTable dashboard={false} columns={columns} rows={cartData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
    </Box>
</Box>
  )
}

export default AbandonedCart
