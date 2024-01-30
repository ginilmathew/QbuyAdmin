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
const FranchiseMarketing = () => {
  const router = useRouter()

  const { data, error, isLoading, mutate } = useSWR(`admin/franchise-marketing`, fetcher);
  const [item, setItem] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const [_id, set_id] = useState<string>('');
  const [loading, setLoding] = useState<boolean>(false);


  useEffect(() => {
    if (data?.data?.data) {
      setItem(data?.data?.data)
    }
  }, [data?.data?.data])

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = (id: any) => {
    set_id(id)
    setOpen(true)
  }




  const columns: GridColDef[] = [
    {
      field: 'Created Date',
      headerName: 'Created Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
    },

    {
      field: 'Franchise ',
      headerName: 'Franchise',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.franchise?.name,

    },

    {
      field: 'promotion_amount',
      headerName: 'Promotion Amount',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => moment(params.row.start_date).format("DD/MM/YYYY"),

    },
    {
      field: 'end_date',
      headerName: 'End Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => moment(params.row.end_date).format("DD/MM/YYYY"),
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
          <BorderColorTwoToneIcon
            onClick={() => EditPage(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }}
          />
          <DeleteOutlineTwoToneIcon
            onClick={() => handleOpen(row?._id)}
            sx={{
              color: '#58D36E',
              cursor: 'pointer',
            }} />
        </Stack>
      )
    }
  ];

  const searchItem = useCallback((value: any) => {
    let competitiions = data?.data?.data?.filter((com: any) => com?.franchise?.name.toString().toLowerCase().includes(value.toLowerCase())  || com?.promotion_amount.toString().toLowerCase().includes(value.toLowerCase())
    )
    startTransition(() => {
      setItem(competitiions)
    })
  }, [item])

  const addFranchise = () => {
    router.push('/franchiseMarketing/addFranchiseMarketing')

  }

  const viewPage = (id: string) => {
    router.push(`/franchiseMarketing/view/${id}`)
  }

  const EditPage = (id: string) => {
    router.push(`/franchiseMarketing/edit/${id}`)
  }

  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
      <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Franchise Marketing' onClick={addFranchise} addbtn={true} />
      <Box py={5}>
        <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
      </Box>
    </Box>

    {open && <CustomDelete
      heading='Franchise marketing'
      paragraph='franchise marketing'
      _id={_id}
      setData={setItem}
      data={item}
      url={`admin/franchise-marketing/delete/${_id}`}
      onClose={handleClose}
      open={open} />}
  </Box>
  )
}

export default FranchiseMarketing
