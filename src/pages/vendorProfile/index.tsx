import React, { useCallback, useState, useTransition, useEffect } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack, Typography } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';

const VendorProfile = () => {

  const router = useRouter();

  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [_id, set_id] = useState<string>('');
  const [serachList, setSearchList] = useState<any>([])
  const [pending, startTransition] = useTransition();



  console.log({ vendorList })

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
      valueGetter:(params) => params?.row?.franchise?.franchise_name
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
      field: 'Actions',
      headerName: 'Actions',
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




  const fetchVendorList = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchData(`/admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`)
      setVendorList(response?.data?.data)
      setSearchList(response?.data?.data)
    }
    catch (err: any) {
      setLoading(false)
      toast.error(err?.message)
    }
    finally {
      setLoading(false)
    }

  }, [vendorList])


  useEffect(() => {
    fetchVendorList()
  }, [])




  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Vendor Profile' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={vendorList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default VendorProfile
