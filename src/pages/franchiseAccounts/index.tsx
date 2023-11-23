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

const FranchiseAccounts = () => {
  const { data, error, isLoading, mutate } = useSWR(`admin/account/franchise/list`, fetcher);
  const router = useRouter()
  const [franchiseeaccountData, setFranchiseeAccountData] = useState([]);
  const [pending, startTransition] = useTransition();


  useEffect(() => {
    if (data?.data?.data) {
      setFranchiseeAccountData(data?.data?.data);
      console.log("Franchisee Data:", data?.data?.data);
    }
  }, [data?.data?.data]);

  const viewFranchiseeAccount = (id: any) => {
    router.push(`/franchiseAccounts/view/${id}`)
  }

  const columns: GridColDef[] = [
    {
      field: 'franchise_id',
      headerName: 'Franchisee ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'franchise_name',
      headerName: 'Franchise Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'owner_name',
      headerName: 'Owner Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'address',
      headerName: 'Location',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'order_count',
      headerName: 'Total Orders',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: 'last_salary_date',
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
            onClick={() => viewFranchiseeAccount(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />

        </Stack>
      )
    }
  ];

  const searchProducts = useCallback((value: string) => {
    const lowercasedValue = value.toLowerCase();
    let results = data?.data?.data?.filter((com: any) => {
        const franchiseId = com?.franchise_id?.toString()?.toLowerCase() ?? "";
        const franchiseName = com?.franchise_name?.toLowerCase() ?? "";
        const ownerName = com?.owner_name?.toLowerCase() ?? "";
        const address = com?.address?.toLowerCase() ?? "";
        return franchiseId.includes(lowercasedValue) ||
               franchiseName.includes(lowercasedValue) ||
               ownerName.includes(lowercasedValue) ||
               address.includes(lowercasedValue);
    });

    startTransition(() => {
        setFranchiseeAccountData(results);
    });
}, [data?.data?.data]);


  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false}  setState={searchProducts} imprtBtn={false} Headerlabel='Franchise Accounts' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={franchiseeaccountData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>

  )
}

export default FranchiseAccounts