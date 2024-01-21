import { fetchData } from '@/CustomAxios'
import { Box, Grid, List } from '@mui/material'
import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput'
import { GridColDef } from '@mui/x-data-grid';
import CustomTable from '@/components/CustomTable'
import CutomSearch from '@/components/CutomSearch'

type Inputs = {
  name: any,
  user_id: any,
  mobile: any,


};

const ProductReportForm = () => {

  const [list, SetList] = useState<any>(null)
  const [search, setSearh] = useState(null)

  const schema = yup
    .object()
    .shape({


    })
    .required();



  const { register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setError,
    setValue, } = useForm<Inputs>({
      resolver: yupResolver(schema),
      defaultValues: {

      }

    });



  const router = useRouter()
  const { id } = router.query


  const columns: GridColDef[] = [
    {
      field: 'product_log_id',
      headerName: 'Product Log ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',


    },
    {
      field: 'mobile',
      headerName: 'Product Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (params.row.product && params.row.product?.name) ? params.row.product?.name : '_'

    },
    {
      field: 'SMS Gateway',
      headerName: 'Store Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => (params.row.product?.store && params.row.product?.store?.name) ? params.row.product?.store?.name : '_'


    },
    {
      field: 'total_view_count',
      headerName: 'Total View Count',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },

  ];


  useEffect(() => {
    const reportlist = async () => {
      try {
        const resp = await fetchData(`/admin/product-viewed-report-details/${process?.env?.NEXT_PUBLIC_TYPE}/${id}`)
        const data = resp?.data?.data;
        setValue('name', data[0]?.user?.name && data[0]?.user?.name)
        setValue('mobile', data[0]?.user?.mobile && data[0]?.user?.mobile)
        setValue('user_id', data[0]?.user?.user_id && data[0]?.user?.user_id)
        console.log({ RESP: data })
        SetList(data)
        setSearh(data)

      } catch (err: any) {

      } finally {

      }

    }

    reportlist()
  }, [])

  const searchItem = useCallback((value: any) => {
    let competitiions = list?.filter((com: any) => com?.product_log_id.toString().toLowerCase().includes(value.toLowerCase()) ||
      com?.product?.name && com?.product?.name.toString().toLowerCase().includes(value.toLowerCase()) || com?.product?.store?.name && com?.product?.store?.name.toString().toLowerCase().includes(value.toLowerCase())
    )
    startTransition(() => {
      setSearh(competitiions)
    })
  }, [list])

  return (
    <Box>
      <CustomBox title='Product Report View'>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2.5}>
            <CustomInput
              type='text'
              control={control}
              error={errors.user_id}
              fieldName="user_id"
              placeholder={``}
              fieldLabel={"User ID"}
              disabled={false}
              view={true}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.5}>
            <CustomInput
              type='text'
              control={control}
              error={errors.name}
              fieldName="name"
              placeholder={``}
              fieldLabel={"Customer Name"}
              disabled={false}
              view={true}
              defaultValue={''}
            />

          </Grid>
          <Grid item xs={12} lg={2.5}>
            <CustomInput
              type='text'
              control={control}
              error={errors.mobile}
              fieldName="mobile"
              placeholder={``}
              fieldLabel={"Customer Mobile"}
              disabled={false}
              view={true}
              defaultValue={''}
            />
          </Grid>

        </Grid>
      </CustomBox>
      <CustomBox title='Product & Store'>
        <Box mt={3}></Box>
        <CutomSearch setState={searchItem} />
        <Box py={5}>
          <CustomTable dashboard={false} columns={columns} rows={search ?? []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
      </CustomBox>
    </Box>
  )
}

export default ProductReportForm