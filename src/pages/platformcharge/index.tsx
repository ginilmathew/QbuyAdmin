import CustomTableHeader from '@/Widgets/CustomTableHeader'
import Custombutton from '@/components/Custombutton'
import { Box, Stack, Typography, Dialog, Grid, } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import CustomTable from '@/components/CustomTable';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CustomInput from '@/components/CustomInput';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { useForm, SubmitHandler } from "react-hook-form";
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

type FormInputs = {
  platformCharge: string
}


const PlatformCharges = () => {



  const [open, setOpen] = useState<boolean>(false);
  const [platformList, setplatformList] = useState<any>([]);





  const HandleOpen = useCallback(() => {
    setOpen(true)
  }, [open])

  const HandleClose = useCallback(() => {
    setOpen(false)
  }, [open])


  const orderValidation = /^[0-9]*$/

  const schema = yup
    .object()
    .shape({
      platformCharge: yup.string().matches(orderValidation, 'Accept only positive number').required('Platform Charge is Required').nullable('Platform Charge is Required'),
    })

  const { register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue, } = useForm<FormInputs>({
      resolver: yupResolver(schema),
    });

  const columns: GridColDef[] = [
    {
      field: '#1',
      headerName: 'S.No',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => "#1"
    },
    {
      field: 'platformCharge',
      headerName: 'Platform Charge',
      flex: 1,
      headerAlign: 'center',
      align: 'center',

    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
  ]





  const GetPlatformCharge = async () => {
    try {

      const response = await fetchData('common/platformcharge')
      setplatformList([response?.data?.data])

    } catch (err) {

    }
  }



  const SubmitFlatform = async (data: any) => {

    const Value = {
      platformCharge: parseInt(data?.platformCharge)
    }
    try {
      await postData('admin/setting', Value);
      toast.success('Platform Charge Added');
      setValue('platformCharge', "")
      GetPlatformCharge();
      HandleClose();
    } catch (err: any) {
      toast.error(err?.message)
    }
  }



  useEffect(() => {
    GetPlatformCharge()
  }, [])




  return (
    <Box px={5} py={2} pt={10} mt={0}>
      <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={60}>
          <Typography fontSize={30} fontWeight={'bold'} color="#58D36E" letterSpacing={1} sx={{ fontFamily: `'Poppins' sans-serif`, }}>Platform Charge</Typography>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={3}>
            <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={HandleOpen} IconEnd={''} IconStart={AddIcon} />
          </Box>
        </Box>
      </Box>
      <Box py={3}>
        <CustomTable dashboard={false} columns={columns} rows={platformList ? platformList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
      </Box>
      <Dialog
        maxWidth={'xs'}
        onClose={HandleClose} open={open}>
        <DialogTitle id="alert-dialog-title">
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box></Box>
            <Typography fontWeight={'bold'} fontSize={22} sx={{
              fontFamily: `'Poppins' sans-serif`,
            }}>Platform Charge</Typography>
            <HighlightOffRoundedIcon sx={{ cursor: 'pointer' }} onClick={HandleClose} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container spacing={2} py={2}>
              <Grid item xs={12} xl={12}>
                <CustomInput
                  type='number'
                  control={control}
                  error={errors.platformCharge}
                  fieldName="platformCharge"
                  placeholder={``}
                  fieldLabel={"Enter Platform Charge"}
                  disabled={false}
                  view={false}
                  defaultValue={''}
                />
              </Grid>
            </Grid>
          </DialogContentText>
          <Box display={'flex'} justifyContent={'center'} py={2} >
            <Custombutton
              btncolor=''
              height={40}
              IconEnd={""}
              IconStart={''}
              startIcon={false}
              endIcon={false}
              onClick={handleSubmit(SubmitFlatform)}
              label='Add' />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default PlatformCharges