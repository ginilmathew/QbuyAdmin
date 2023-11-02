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

type props = {
    res?: any,
    view?: any

}
const ShipmentSupport = ({ res, view }: props) => {

    console.log({res})
    const idd = res ? res : view;

    const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/shipment/list/${res}`, fetcher);
  const [shippmentData, setShippmentData] = useState([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (data?.data?.data) {
        setShippmentData(data?.data?.data);
      console.log("shipment Data:", data?.data?.data);
    }
  }, [data?.data?.data]);

 
  const columns: GridColDef[] = [
    {
      field: 'rider_id',
      headerName: 'Order ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Ordered Date & Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'mobile',
      headerName: 'Order Total',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'Franchisee',
      headerName: 'Amount Earned',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },

    {
      field: 'Total Order Amount',
      headerName: 'Ordered Completed Date & Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },
    {
        field: 'Total Order Amounts',
        headerName: 'Status',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
  
      },
   
  ];
  const searchProducts = useCallback((value: any) => {
    let Results = data?.data?.data?.filter((com: any) =>
        com?.rider_id.toString().includes(value) ||
        com?.mobile.toString().includes(value) 
    );

    startTransition(() => {
        setShippmentData(Results);
    });
}, [shippmentData]);


  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={shippmentData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default ShipmentSupport