import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';



const fetcher = (url: any) => fetchData(url).then((res) => res);
const PandaCoins = () => {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(`admin/panda-coins/list`, fetcher);
  const [item, setItem] = useState([]);



  useEffect(() => {
    if (data?.data?.data) {
      setItem(data?.data?.data)
    }
  }, [data?.data?.data])


  console.log({item},'ITEM PANDA COINS')


  const columns: GridColDef[] = [
    {
      field: 'Created Date',
      headerName: 'Created Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY hh:mm A"),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'User',
      headerName: 'User',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.user?.name,

    },

    // {
    //   field: 'Discount Type',
    //   headerName: 'Franchise',
    //   flex: 1,
    //   headerAlign: 'center',
    //   align: 'center',
    //   valueGetter: (params) => params.row.franchise?.franchise_name,

    // },
    {
      field: 'value',
      headerName: 'Value',
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
  onClick={()=>viewPage(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />
          <BorderColorTwoToneIcon
  onClick={()=>EditPage(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }}
          />
          
        </Stack>
      )
    }
  ];

 

  const searchItem = useCallback((value: any) => {
    let competitiions = data?.data?.data?.filter((com: any) => com?.type?.toString().toLowerCase().includes(value.toLowerCase()) || com?.franchise?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.value?.toString().toLowerCase().includes(value.toLowerCase())
    )
    startTransition(() => {
      setItem(competitiions)
    })
  }, [item])

  const addpandaCoins = () => {
    router.push('/pandaCoins/addPandaCoins')

  }

  const viewPage = (id:any) => {
    router.push(`/pandaCoins/view/${id}`)

  }
  const EditPage = (id:any) => {
    router.push(`/pandaCoins/edit/${id}`)

  }


  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader setState={searchItem} addbtn={true} imprtBtn={false} Headerlabel='Panda Coins' onClick={addpandaCoins} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default PandaCoins
