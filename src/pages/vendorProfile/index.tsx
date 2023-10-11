import React, { useCallback, useState, useTransition, useEffect } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next";
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });


type props = {
  req: any,
  res: any
}

// type datapr = {
//     data: any
// }
// // This gets called on every request
// export async function getServerSideProps({ req, res }: props) {
//     // Fetch data from external API
//     //const res = await fetch(`https://.../data`);
//     //const data = await res.json();

//     let session = await getServerSession(req, res, authOptions)

//     let token = session?.user?.accessToken

//     const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     const data = await resu.json();



//     // Pass data to the page via props
//     return { props: { data : data } };
// }
const fetcher = (url: any) => fetchData(url).then((res) => res);

const VendorProfile = () => {

  const { data, error, isLoading } = useSWR(`/admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);


  const router = useRouter();

  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [_id, set_id] = useState<string>('');
  const [serachList, setSearchList] = useState<any>([])
  const [pending, startTransition] = useTransition();



  useEffect(() => {
    if (data?.data?.data) {
      setVendorList(data?.data?.data)
    }
  }, [data?.data?.data])

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
      field: 'display_order',
      headerName: 'Order',
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
      valueGetter: (params) => params?.row?.franchise?.franchise_name
    },
    // {
    //   field: 'Category',
    //   headerName: 'Category',
    //   flex: 1,
    //   headerAlign: 'center',

    //   renderCell: ({ row }) => (
    //     <>
    //       {row?.category_id?.map((res: any) => (
    //         <Typography>{res?.name},</Typography>
    //       ))}
    //     </>
    //   )
    // },
    {
      field: 'Action',
      headerName: 'Action',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack alignItems={'center'} gap={1} direction={'row'}>
          <RemoveRedEyeIcon
            onClick={() => viewvendorDetails(row?._id)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />

        </Stack>
      )
    }
  ];



  const viewvendorDetails = (id: any) => {
    router.push(`/vendor/view/${id}`)

  }




  // const fetchVendorList = useCallback(async () => {
  //   try {
  //     setLoading(true)
  //     const response = await fetchData(`/admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`)
  //     setVendorList(response?.data?.data)
  //     setSearchList(response?.data?.data)
  //   }
  //   catch (err: any) {
  //     setLoading(false)
  //     toast.error(err?.message)
  //   }
  //   finally {
  //     setLoading(false)
  //   }

  // }, [vendorList])


  const searchVendor = useCallback((value: any) => {
    let Result = data?.data?.data?.filter((com: any) => com?.store_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase))
    startTransition(() => {
      setVendorList(Result)
    })
  }, [vendorList])


  // useEffect(() => {
  //   fetchVendorList()
  // }, [])
  if (isLoading) {
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader setState={searchVendor} addbtn={false} imprtBtn={false} Headerlabel='Vendor Profile' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={[]} id={"id"} loading={true} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  }

  if (error) {
    toast.error(error?.message)
  }



  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader setState={searchVendor} addbtn={false} imprtBtn={false} Headerlabel='Vendor Profile' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={vendorList ? vendorList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default VendorProfile
