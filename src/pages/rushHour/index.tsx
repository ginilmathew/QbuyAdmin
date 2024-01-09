
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import { useRouter } from 'next/router'
import { fetchData, postData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';
import CustomDelete from '@/Widgets/CustomDelete';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';



const fetcher = (url: any) => fetchData(url).then((res) => res);
function RushHour() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(`/admin/rush-hour/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState([]);
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

  const addSlider = () => {
    router.push('/rushHour/addRushHour')
  }


  const viewPage = (row: any) => {

    router.push(
      `/rushHour/view/${row?._id}`,

    );
    // router.push(`/rushHour/view/${id}`)
  }

  const editPage = (row: any) => {
    router.push(
      `/rushHour/edit/${row?._id}`);
  }

  const columns: GridColDef[] = [
    {
      field: 'Date Created', headerName: 'Date Created', flex: 1, headerAlign: 'center',
      align: 'center', valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
    },
    {
      field: 'Franchisee',
      headerName: 'Franchisee',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.franchisee?.franchise_name,

    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'start_date_time',
      headerName: 'Start Date & Time(Hrs)',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'end_date_time',
      headerName: 'End Date & Time(Hrs)',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },

    {
      field: 'Status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack alignItems={'center'} gap={1} direction={'row'}>
          <CustomSwitch
            changeRole={(e: any) => OnchangeCheck(e, row?._id)}
            checked={row?.status === 'active' ? true : false}

          />

        </Stack>
      )
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
            onClick={() => viewPage(row)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />
          <BorderColorTwoToneIcon
            onClick={() => editPage(row)}
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

  const OnchangeCheck = async (e: any, id: string) => {

    let value = {
      id: id,
      status: e.target.checked === true ? "active" : "inactive"
    }

    try {
      setLoding(true)
      const response = await postData('admin/rush-hour/status', value)
      console.log({ response })
      // setProductList((prev: any) => ([response?.data?.data, ...prev?.filter((res: any) => res?._id !== response?.data?.data?._id)]))
      mutate()
    }
    catch (err: any) {
      toast.warning(err?.message)
    } finally {
      setLoding(false)

    }

  }



  const searchItem = useCallback((value: any) => {
    let competitiions = data?.data?.data?.filter((com: any) => com?.franchisee?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) ||
        com?.message.toString().toLowerCase().includes(value.toLowerCase()) 
    )
    startTransition(() => {
        setItem(competitiions)
    })
}, [item])


  return (
    <Box px={5} py={2} pt={10} mt={0}>

      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Rush Hour' onClick={addSlider} addbtn={true} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
      {open && <CustomDelete
        heading='Rush Hour'
        paragraph='rush hour'
        _id={_id}
        setData={setItem}
        data={item}
        url={`admin/rush-hour/delete/${_id}`}
        onClose={handleClose}
        open={open} />}
    </Box>
  )
}

export default RushHour