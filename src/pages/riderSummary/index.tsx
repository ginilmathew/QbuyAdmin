import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';


const RiderSummary = () => {
  const router = useRouter()


  const columns: GridColDef[] = [
    { field: 'Rider ID', headerName: 'Rider ID', flex: 1, },
    {
      field: 'Rider Name',
      headerName: 'Rider Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Login Hrs ',
      headerName: 'Login Hrs',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'COD',
      headerName: 'COD',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Vendor Due',
      headerName: 'Vendor Due',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Rider Paid',
      headerName: 'Rider Paid',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Rider Due',
      headerName: 'Rider Due',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Online Paid',
      headerName: 'Online Paid',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Total Kms Travelled',
      headerName: 'Total Kms Travelled',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Cancelled Orders ',
      headerName: 'Cancelled Orders  ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Denials',
      headerName: 'Denials',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Completed Orders',
      headerName: 'Completed Orders',
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
  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader imprtBtn={false} Headerlabel='Rider Support' onClick={null} addbtn={false} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default RiderSummary
