
import { Box, Stack } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition, startTransition } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment'
import { fetchData } from '@/CustomAxios';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);
const index = () => {
  const router = useRouter()

  // type: process?.env?.NEXT_PUBLIC_TYPE,

  // const { data, error, isLoading, mutate } = useSWR(`/product-viewed-report/{type}'`, fetcher);
  const [startDate,setStartDate]=useState(null)
  const [endDate,setEndDate]=useState(null)
  const { data, error, isLoading, mutate } = useSWR(`/admin/product-viewed-report/${process?.env?.NEXT_PUBLIC_TYPE}/${startDate}/${endDate}`, fetcher);
  const [item, setItem] = useState(null)


  useEffect(() => {
    if (data?.data?.data) {
      setItem(data?.data?.data)
    }
  }, [data?.data?.data])

  const columns: GridColDef[] = [
    {
      field: 'user_id',
      headerName: 'Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'mobile',
      headerName: 'Customer ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'SMS Gateway',
      headerName: 'Date Viewed',
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
      headerName: 'Customer Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (moment(params?.row?.updated_at).format('DD/MM/YYYY hh:mm A')),

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
            onClick={() => ViewPage(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />


        </Stack>
      )
    }



  ];


  const ViewPage = (row: any) => {

    console.log({ row })
    router.push({
      pathname: `/productReportView/view/${row?._id}`,
      query: { hello: 'hello' },
    });
  }

  const searchProducts = useCallback((value: any) => {
    let Results = data?.data?.data?.filter((com: any) =>
      com?.user_id.toString().includes(value) ||
      com?.mobile.toString().includes(value)
    );

    startTransition(() => {
      setItem(Results);
    });
  }, [item]);

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

  if (isLoading) {
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='OTP View' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} loading={true} rows={[]} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  }
  if (error) {
    toast.error(error?.message);
  }
  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='Product Viewed Report' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default index