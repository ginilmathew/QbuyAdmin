import React, { startTransition, useCallback, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

type props = {
  req: any,
  res: any
}

type datapr = {
  data: any
}
// This gets called on every request
export async function getServerSideProps({ req, res }: props) {
  // Fetch data from external API
  //const res = await fetch(`https://.../data`);
  //const data = await res.json();

  let session = await getServerSession(req, res, authOptions)

  let token = session?.user?.accessToken

  const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/account/vendors/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await resu.json();



  // Pass data to the page via props
  return { props: { data: data } };
}

const VendorAccounts = ({ data }: datapr) => {

  const router = useRouter()



  const [loading, setLoading] = useState<boolean>(false);
  const [vendorAccountsList, setVendorAccountsList] = useState<any>(data?.data);
  const [serachList, setSearchList] = useState<any>(data?.data)





  const columns: GridColDef[] = [
    {
      field: 'vendor_id',
      headerName: 'Vendor ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor Name',
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
      field: 'Franchise',
      headerName: 'Franchise',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params?.row?.franchise?.franchise_name,

    },
    {
      field: 'store_address',
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
      field: 'Last Payment Date',
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
            onClick={() => NavigatetoView(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />

        </Stack>
      )
    }
  ];


  async function gettvendorsAccounts() {
    try {
      setLoading(true);
      const res = await fetchData('/account/vendors/list');
      setVendorAccountsList(res?.data?.data)
      setLoading(false);

    } catch (err: any) {
      toast.error(err)
      setLoading(false);
    }

  }

  const NavigatetoView = useCallback((id: string) => {
    router.push(`/vendorAccounts/view/${id}`)
  }, [])

  const searchVendor = useCallback((value: any) => {
    let Result = serachList?.filter((com: any) => com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.store_name?.toString().toLowerCase().includes(value.toLowerCase()))
    startTransition(() => {
      setVendorAccountsList(Result)
    })
  }, [vendorAccountsList])





  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Vendor Accounts' onClick={() => null} setState={searchVendor} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={vendorAccountsList ? vendorAccountsList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default VendorAccounts