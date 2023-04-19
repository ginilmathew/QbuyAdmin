import React, { useState, useEffect, useTransition } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';
import moment from 'moment'

const SalesReport = () => {


  const [loading, setLoading] = useState<boolean>(false);
  const [reportList, setReportList] = useState<any>([])
  const [pending, startTransition] = useTransition();
  const [serachList, setSearchList] = useState<any>([])


  const columns: GridColDef[] = [
    {
      field: 'Date',
      headerName: 'Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY')),
    },
    {
      field: 'vendor_id',
      headerName: 'Customer ID',
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
      field: 'Total Sales',
      headerName: 'Total Sales',
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



  const SalesReport = async () => {
    try {
      setLoading(true)
      const response = await fetchData('admin/customer-sales-report')
      setReportList(response?.data?.data)
      setSearchList(response?.data?.data)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)

    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    SalesReport()
  }, [])


  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={1} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Sales Report' onClick={() => null} />
        <Box py={3}>
          <CustomTable dashboard={false} columns={columns} rows={reportList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>

  )
}

export default SalesReport
