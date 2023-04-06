import React from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';

const VendorAccounts = () => {


  const columns: GridColDef[] = [
    {
      field: 'Vendor ID',
      headerName: 'Vendor ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Vendor Name',
      headerName: 'Vendor Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Store Name',
      headerName: 'Store Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
 
    {
      field: 'Franchise',
      headerName: 'Franchise',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Location',
      headerName: 'Location',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Total Orders',
      headerName: 'Total Orders',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Last Payment Date',
      headerName: 'Last Payment Date',
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
  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
      <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Vendor Accounts' onClick={() => null} />
      <Box py={5}>
        <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
      </Box>
    </Box>
  </Box>
  )
}

export default VendorAccounts