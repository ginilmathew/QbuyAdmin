
import { Box, Grid, Stack, Typography } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition, startTransition } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment'
import { fetchData } from '@/CustomAxios';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { yupResolver } from "@hookform/resolvers/yup";
import CutomSearch from '@/components/CutomSearch';
import CustomDatePicker from '@/components/CustomDatePicker';
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);
const index = () => {
  const router = useRouter()

  type IFormInput = {

    start_date: string,

    end_date: string
  }

  // type: process?.env?.NEXT_PUBLIC_TYPE,

  // const { data, error, isLoading, mutate } = useSWR(`/product-viewed-report/{type}'`, fetcher);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null)
  const { data, error, isLoading, mutate } = useSWR(`/admin/product-viewed-report/${process?.env?.NEXT_PUBLIC_TYPE}/${startDate ? moment(startDate).format('YYYY-MM-DD') : startDate}/${endDate ? moment(endDate).format('YYYY-MM-DD') : endDate}`, fetcher);
  const [item, setItem] = useState(null)




  useEffect(() => {
    if (data?.data?.data) {
      setItem(data?.data?.data)
    }
  }, [data?.data?.data])


  const schema = yup
    .object()
    .shape({

    })

  const { register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {

    }
  });


  const columns: GridColDef[] = [
    {
      field: 'user_id',
      headerName: 'Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
    },
    {
      field: 'mobile',
      headerName: 'Customer Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (params.row.customer && params.row.customer?.name) ? params.row.customer?.name : '_'

    },
    {
      field: 'SMS Gateway',
      headerName: 'Customer Mobile',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (params.row.customer && params.row.customer?.mobile) ? params.row.customer?.mobile : '_'

    },
    {
      field: 'productviewd',
      headerName: 'Product View',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (params.row.product && Array.isArray(params.row.product)) && params.row?.product?.map((res: any) => res?.name).join()
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
            onClick={() => ViewPage(row)}
            style={{
              color: '#58D36E',
              cursor: 'pointer'
            }} />
        </Stack>
      )
    }
  ];


  class DateFilter {
    static startDate(value: any) {
      // let val = moment(value).format('YYYY-MM-DD')
      setValue('start_date', value)
      setStartDate(value)
      setError('start_date', { message: "" })
    }

    static endDate(value: any) {
      // let val = moment(value).format('YYYY-MM-DD')
      setValue('end_date', value)
      setEndDate(value)

      setError('end_date', { message: "" })
    }
  }




  const ViewPage = (row: any) => {
    router.push({
      pathname: `/productReportView/view/${row?.customer?._id}`,
      // query: { customer: 'hello' },
    });
  }

  const searchItem = useCallback((value: any) => {
    let competitiions = data?.data?.data?.filter((com: any) => com?.customer?.name && com.customer?.name.toString().toLowerCase().includes(value.toLowerCase()) ||
      com?.customer.mobile && com.customer?.mobile.toString().toLowerCase().includes(value.toLowerCase())
    )
    startTransition(() => {
      setItem(competitiions)
    })
  }, [item])



  if (isLoading) {
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='OTP View' onClick={() => null} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} loading={true} rows={[]} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  }

  if (error) {
    toast.error(error?.message);
  }




  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontSize={30} fontWeight={'bold'} color="#58D36E" letterSpacing={1} sx={{ fontFamily: `'Poppins' sans-serif`, }}>
            {'Product Viewed Report'}
          </Typography>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={4}>
                <CustomDatePicker
                  fieldName={"start_date"}
                  control={control}
                  error={errors?.start_date}
                  past={true}
                  fieldLabel={"Start Date"}
                  values={startDate}
                  changeValue={(date) => DateFilter.startDate(date)} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <CustomDatePicker
                  fieldName={"end_date"}
                  control={control}
                  error={errors?.end_date}
                  past={false}
                  fieldLabel={'End Date'}
                  values={endDate}
                  changeValue={(date) => DateFilter.endDate(date)} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <Box mt={3}></Box>
                <CutomSearch setState={searchItem} />
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <CustomTableHeader addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='Product Viewed Report' onClick={() => null} /> */}
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={item ? item : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </Box>
    </Box>
  )
}

export default index