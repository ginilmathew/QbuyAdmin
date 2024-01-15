'use client'


import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import { fetchData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';

const fetcher = (url: any) => fetchData(url).then((res) => res);
const index = () => {
  const router = useRouter()

  const { data, error, isLoading, mutate } = useSWR(`admin/customer-review`, fetcher);
  const [item, setItem] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const [_id, set_id] = useState<string>('');
  const [loading, setLoding] = useState<boolean>(false);


  useEffect(() => {
    if (data?.data?.data) {
      setItem(data?.data?.data)
    }
  }, [data?.data?.data])

  const columns: GridColDef[] = [
    {
      field: 'order_id',
      headerName: 'Order ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },

    {
      field: 'iorder ',
      headerName: 'Order Date & Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY hh:mm A"),

    },

    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'customer_mobile',
      headerName: 'Phone Number',
      flex: 1,
      headerAlign: 'center',
      align: 'center',


    },
    {
      field: 'store_name',
      headerName: 'Store Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'store_rating',
      headerName: 'Store Rating Given',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'rider_name',
      headerName: 'Rider Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'rider_rating',
      headerName: 'Rider Rating Given',
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
            onClick={() => viewPage(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />

        </Stack>
      )
    }
  ];

  const viewPage = (id: string) => {
    router.push(`/latestOrderReview/view/${id}`)
  }

  const searchItem = useCallback((value: any) => {
    let competitiions = data?.data?.data?.filter((com: any) => com?.customer_name?.toString().toLowerCase().includes(value.toLowerCase()) || com?.order_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.rider_name?.toString().toLowerCase().includes(value.toLowerCase())
    )
    startTransition(() => {
      setItem(competitiions)
    })
  }, [item])
  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Latest Order Reviews' onClick={() => null} addbtn={true} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>


    </Box>
  )
}

export default index