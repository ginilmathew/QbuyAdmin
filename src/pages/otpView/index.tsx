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

const OTP_View = () => {

    const [loading, setLoading] = useState(false);
    const [otpData, setOtpData] = useState([]);
    const [searchList, setSearchList] = useState([]);

  const columns: GridColDef[] = [
    {
        field: 'user_id',
        headerName: 'ID',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
  
    },
    {
        field: 'mobile',
        headerName: 'Mobile',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
  
    },
    {
        field: 'SMS Gateway',
        headerName: 'SMS Gateway',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
  
    },

    {
        field: 'Issue',
        headerName: 'Issue',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
  

    },
    {
        field: 'Date & Time',
        headerName: 'Date & Time',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY hh:mm A')),

    },
   
    {
        field: 'loginotp',
        headerName: 'OTP',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
  
    },
   
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
      const userIdMatch = item?.user_id.toString().toLowerCase().includes(value.toLowerCase());
      const mobileMatch = item?.mobile.toString().toLowerCase().includes(value.toLowerCase());
      return userIdMatch || mobileMatch;
    });

    setOtpData(filteredData);
  }, [searchList]);



    const fetchOTPData = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/otp-view`);
            console.log(response?.data?.data);
            setOtpData(response?.data?.data); 
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOTPData()
    }, [])

  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} setState={searchProducts}  imprtBtn={false} Headerlabel='OTP View' onClick={() => null} />
        <Box py={5}>
            <CustomTable dashboard={false} columns={columns} rows={otpData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
    </Box>
</Box>

  )
}

export default OTP_View
