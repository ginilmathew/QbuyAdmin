import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { Box } from '@mui/material'
import React from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
const VendorRegister = () => {

   const row =[{id:'name',name:'ginil',person:'hhh'}]
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
    
  ];



    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
            <CustomTableHeader setState={"searchVendor"} addbtn={false} imprtBtn={false} Headerlabel='Vendor Register' onClick={() => null} />
            <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={[]} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
            </Box>
        </Box>
    )
}

export default VendorRegister