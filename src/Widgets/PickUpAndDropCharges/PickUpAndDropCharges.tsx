import { Box, Grid, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Customselect from '@/components/Customselect';
import { fetchData, postData } from '@/CustomAxios';
import Custombutton from '@/components/Custombutton';

type IFormInput = {
  franchise: any,
  vehicle_type: any,
  within: any,
  normal_charge: any,
  rate_per_km: any
}
type props = {
  res?: any
  view?: any
}


const PickUpAndDropCharges = ({ view, res }: props) => {
  const router = useRouter()
  const { id:idd } = router.query;

  const [franchiseList, setFranchiseList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
  const [vechicleList, setVechicleList] = useState<any>([])
  const [vechicleSelect, setVechicleSelect] = useState<any>(null)


  const schema = yup
    .object()
    .shape({
      franchise: yup.string().required('Required'),
      vehicle_type: yup.string().required('Required'),
      within: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
      normal_charge: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
      rate_per_km: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),

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

  useEffect(() => {
    const getmapList = async () => {
      try {
        setLoading(true)
        const response = await fetchData('/admin/franchise/list')
        const resp = await fetchData('/admin/vehicle-type')
        setVechicleList(resp?.data?.data)
        setFranchiseList(response?.data?.data)

      } catch (err: any) {
        toast.error(err?.message)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    getmapList()
  }, [])

  useEffect(() => {
    const getsingleList = async () => {
      try {
        let response = await fetchData(`admin/pick-up-and-drop-charge/show/${idd}`)
        let data = response?.data?.data;

        setFranchiseSelect(data?.franchise?.franchise_id);
        setVechicleSelect(data?.vehicle_type?.id)
        data.franchise = data?.franchise?.franchise_id
        data.vehicle_type = data?.vehicle_type?.id

        reset(data)

        // reset(response?.data?.data)

      } catch (err: any) {
        toast.error(err?.message)
      }


    }
    if (idd) {
      getsingleList()
    }

  }, [idd])


  const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {


    const { value } = e.target;
    console.log({ value })
    setValue('franchise', value)
    setError('franchise', { message: '' })
    setFranchiseSelect(value)

  }

  const onselectVechicle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValue('vehicle_type', value)
    setError('vehicle_type', { message: '' })
    setVechicleSelect(value)
  }

  const onSubmit = async (data: any) => {
    let { _id: franchise_id, franchise_name } = franchiseList?.find((res: any) => res?._id === franchiseSelect);
    let { _id: id, name } = vechicleList?.find((res: any) => res?._id === vechicleSelect);
    data.franchise = { franchise_id, franchise_name }
    data.vehicle_type = { id, name }

    if (idd) {
      data.id = idd;
    }
    delete data?._id
    delete data?.created_at
    delete data?.updated_at
    try {
      const CREATE = 'admin/pick-up-and-drop-charge/create';
      const UPDATE = 'admin/pick-up-and-drop-charge/update';
      await postData(res ? UPDATE : CREATE, data)
      toast.success(res ? 'Update Successfully' : 'Created Successfully');
      router.back()
    } catch (err: any) {
      toast.error(err?.message)
    } finally {

    }
  }


  return (
    <Box>
      <CustomBox title='PickUp & Drop'>
        <Grid container spacing={2}>

          <Grid item xs={12} lg={2}>
            <Customselect
              disabled={view ? true : false}
              type='text'
              control={control}
              error={errors.franchise}
              fieldName="franchise"
              placeholder={``}
              fieldLabel={"Franchise"}
              selectvalue={""}
              height={40}
              label={''}
              size={16}
              value={franchiseSelect}
              options={''}
              onChangeValue={onselectFranchise}
              background={'#fff'}
            >
              <MenuItem value="" disabled >
                <>Select Franchise</>
              </MenuItem>
              {franchiseList && franchiseList?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
                <MenuItem value={res?._id}>{res?.franchise_name}</MenuItem>
              ))}
            </Customselect>


          </Grid>
          <Grid item xs={12} lg={2}>
            <Customselect
              disabled={view ? true : false}
              type='text'
              control={control}
              error={errors.vehicle_type}
              fieldName="vehicle_type"
              placeholder={``}
              fieldLabel={"Vechicle Type"}
              selectvalue={""}
              height={40}
              label={''}
              size={16}
              value={vechicleSelect}
              options={''}
              onChangeValue={onselectVechicle}
              background={'#fff'}
            >
              <MenuItem value="" disabled >
                <>Select Franchise</>
              </MenuItem>
              {vechicleList && vechicleList?.map((res: any) => (
                <MenuItem value={res?._id}>{res?.name}</MenuItem>
              ))}
            </Customselect>


          </Grid>
          <Grid item xs={12} lg={2}>
            <CustomInput
              type='text'
              control={control}
              error={errors.within}
              fieldName="within"
              placeholder={``}
              fieldLabel={"within (km)"}
              disabled={false}
              view={false}
              defaultValue={''}
            />

          </Grid>
          <Grid item xs={12} lg={2}>
            <CustomInput
              type='text'
              control={control}
              error={errors.normal_charge}
              fieldName=".normal_charge"
              placeholder={``}
              fieldLabel={"Normal Charge"}
              disabled={false}
              view={false}
              defaultValue={''}
            />

          </Grid>
          <Grid item xs={12} lg={2}>
            <CustomInput
              type='text'
              control={control}
              error={errors.rate_per_km}
              fieldName=".rate_per_km"
              placeholder={``}
              fieldLabel={"Rate per(Km)"}
              disabled={false}
              view={false}
              defaultValue={''}
            />

          </Grid>

        </Grid>
      </CustomBox>
      {!view &&
        <Box py={3}>
          <Custombutton
            btncolor=''
            IconEnd={''}
            IconStart={''}
            endIcon={false}
            startIcon={false}
            height={''}
            label={res ? 'Update' : 'Add Charge'}
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          />
        </Box>}
    </Box>
  )
}

export default PickUpAndDropCharges