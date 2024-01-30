import { Box, Grid, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import { useRouter } from 'next/router'
import CustomInput from '@/components/CustomInput'
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler } from "react-hook-form";
import Customselect from '@/components/Customselect'
import Custombutton from '@/components/Custombutton'
import { fetchData, postData } from '@/CustomAxios'

type props = {
  res?: any
  view?: any
}


type IFormInput = {
  name: string,
  discount_type: string,
  discount_value: string,
  type: string


}
const CustomerGroupForm = ({ view, res }: props) => {

  const router = useRouter()
  const { id } = router.query

  const [type, setType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [singleList, setSingleList] = useState<any>(null)
  const orderValidation = /^[0-9]*$/
  const schema = yup
    .object()
    .shape({
      name: yup
        .string()
        .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
        .max(40)
        .required('Required'),
      discount_type: yup
        .string().required('Required'),
      discount_value: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),

    })

  const { register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
    reset,
    setValue, } = useForm<IFormInput>(
      {
        resolver: yupResolver(schema),
        defaultValues: {

          type: process?.env?.NEXT_PUBLIC_TYPE

        }
      }
    );

  const onChageType = (e: any) => {
    const { value } = e.target;
    setType(value)
    setValue('discount_type', value)

    setError('discount_type', { message: '' })
  }


  const getSingleShow = async () => {

    try {
      setLoading(true)
      const resp = await fetchData(`admin/customer-group/show/${id}`)
      setSingleList(resp?.data?.data)
    } catch (err: any) {

    } finally {
      setLoading(false)
    }

  }


  useEffect(() => {
    if (view || res) {
      getSingleShow()
    }
  }, [])


  useEffect(() => {
    if (singleList) {
      setValue('discount_value', singleList?.discount_value)
      setValue('name', singleList?.name)
      setValue('discount_type', singleList?.discount_type)
      setType(singleList?.discount_type)

    }
  }, [singleList])


  const submitForm = async (data: any) => {
    const CreateURL = 'admin/customer-group/create'
    const EditUrl = 'admin/customer-group/update'
    if (res) {
      data.id = id
    }
    try {
      setLoading(true)
      await postData(res ? EditUrl : CreateURL, { ...data });
      toast.success(res ? 'Updated Successfully' : 'Created Successfully');
      router.push('/customerGroups')
      reset();
    } catch (err: any) {
      toast.error(err.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <CustomBox title='Cutomer Group Details'>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.name}
              fieldName="name"
              placeholder={``}
              fieldLabel={"Name"}
              disabled={false}
              view={view ? true : false}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <Customselect
              disabled={view ? true : false}
              type='text'
              control={control}
              error={errors.discount_type}
              fieldName="discount_type"
              placeholder={``}
              fieldLabel={"Discount Type"}
              selectvalue={""}
              height={40}
              label={''}
              size={16}
              value={type}
              options={''}
              onChangeValue={onChageType}
              background={'#fff'}
            >
              <MenuItem
                value={'Fixed Rate'}>Fixed Rate</MenuItem>
              <MenuItem value={'Percentage'}>Percentage</MenuItem>

            </Customselect>
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.discount_value}
              fieldName="discount_value"
              placeholder={``}
              fieldLabel={"Discount Value"}
              disabled={false}
              view={view ? true : false}
              defaultValue={''}
            />
          </Grid>
        </Grid>

      </CustomBox>
      {!view &&
        <Box py={3}>
          <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? "Edit Group" : 'Add Group'} onClick={handleSubmit(submitForm)} />
        </Box>}
    </Box>
  )
}

export default CustomerGroupForm