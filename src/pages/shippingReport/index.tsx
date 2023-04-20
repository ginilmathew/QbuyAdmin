import React, { useTransition,useState,useEffect } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import moment from 'moment'
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';

const ShippingReport = () => {

  
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
      field: 'Customer ID',
      headerName: 'Customer ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Customer Name',
      headerName: 'Customer Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
 
    {
      field: 'Order ID',
      headerName: 'Order ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'Delivery Location',
      headerName: 'Delivery Location',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Delivery Type',
      headerName: 'Delivery Type',
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



  const ShippingReport = async () => {
    try {
      setLoading(true)
      const response = await fetchData('admin/customer-shipping-report')
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
    ShippingReport()
  }, [])

  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={1} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Shipping Report' onClick={() => null} />
        <Box py={2}>
          <CustomTable dashboard={false} columns={columns} rows={reportList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>

  )
}

export default ShippingReport
