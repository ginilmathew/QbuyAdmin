import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { Box, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';

const Customer = () => {

    const router = useRouter()


    const columns: GridColDef[] = [
        {
            field: 'franchise_id',
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
            field: 'owner_nssame',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'owner_namsse',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'owner_name',
            headerName: 'Date Added',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Status',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Typography
                    sx={{ fontFamily: `'Poppins' sans-serif`, fontSize: 14, color: '#939393' }}
                >{row?.mobile}</Typography>)

        },
        {
            field: 'email',
            headerName: 'Actions',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },



    ];



    const row = []


    const NavigateToaddCustomer = useCallback(() => {
        router.push('/customerDetails/addCustomer')

    }, []);




    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={''} addbtn={true} imprtBtn={false} Headerlabel='Customer' onClick={NavigateToaddCustomer} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default Customer