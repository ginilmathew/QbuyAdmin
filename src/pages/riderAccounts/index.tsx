import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);

const RiderAccounts = () => {
  const { data, error, isLoading, mutate } = useSWR(`admin/rider-account/list`, fetcher);
  const router = useRouter()
  const [rideraccountData, setRiderAccountData] = useState([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (data?.data?.data) {
      setRiderAccountData(data?.data?.data);
      console.log("Riders Data:", data?.data?.data);
    }
  }, [data?.data?.data]);

  const viewRiderAccount = (id: any) => {
    router.push(`/riderAccounts/view/${id}`)
  }

  const columns: GridColDef[] = [
    {
      field: 'rider_id',
      headerName: 'Rider ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Rider Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'mobile',
      headerName: 'Phone',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'franchise_name',
      headerName: 'Franchisee',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params?.row?.primary_franchise?.franchise_name,
    },

    {
      field: 'last_salary_date',
      headerName: 'Last Salary Released Date',
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
            onClick={() => viewRiderAccount(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />

        </Stack>
      )
    }
  ];
  const searchProducts = useCallback((value: any) => {
    let Results = data?.data?.data?.filter((com: any) =>
      com?.rider_id.toString().includes(value) ||
      com?.mobile.toString().includes(value) ||
      com?.name.toString().toLowerCase().includes(value.toLowerCase())  ||
      com?.primary_franchise?.franchise_name?.toLowerCase().includes(value.toLowerCase())
    );

    startTransition(() => {
      setRiderAccountData(Results);
    });
  }, [rideraccountData]);


  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='Rider' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={rideraccountData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default RiderAccounts