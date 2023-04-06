import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';

const MerchantMarketing = () => {
  const router = useRouter()


  const [open, setOpen] = useState<boolean>(false)

  console.log({ open })

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const addMerchant = () => {
    router.push('/merchantMarketing/addMerchantMarketing')

  }




  const columns: GridColDef[] = [
    { field: 'Merchant ID', headerName: 'Merchant ID', flex: 1, },
    {
      field: ' Name',
      headerName: ' Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Franchise ',
      headerName: 'Franchise',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Marketing Exp.',
      headerName: 'Marketing Exp.',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Total Revenue',
      headerName: 'Total Revenue',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Order Done',
      headerName: 'Order Done',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Order Cancelled',
      headerName: 'Order Cancelled',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'No.of.Clicks',
      headerName: 'No.of.Clicks',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Order Conversion',
      headerName: 'Order Conversion',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Expiry Date',
      headerName: 'Expiry Date',
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
          <BorderColorTwoToneIcon

            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }}
          />
          <DeleteOutlineTwoToneIcon
            onClick={() => handleOpen()}
            sx={{
              color: '#58D36E',
              cursor: 'pointer',
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
        <CustomTableHeader imprtBtn={false} Headerlabel='Merchant Marketing' onClick={addMerchant} addbtn={true} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>

      {open && <CustomDelete onClose={() => handleClose()} open={open} />}
    </Box>
  )
}

export default MerchantMarketing
