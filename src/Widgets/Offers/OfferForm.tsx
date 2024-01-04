import CustomInput from '@/components/CustomInput'
import { Box, Grid, MenuItem, Typography } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTextarea from '@/components/CustomTextarea';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomSelectSearch from '@/components/CustomeSelectSearch';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { postData } from '@/CustomAxios';

type props = {
  res?: any,
  view?: any,

}

const OfferForm = ({ res, view }: props) => {

  const [inputValue, setInputValue] = useState<any>('');
  const [custArray, setCustArray] = useState([])

  const [dataa, setDataa] = useState<any>('')
  const { register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue, } = useForm<FormInputs>();

  const CustmerSearch = (value: any, newvalue: any) => {
    setDataa(newvalue)
    console.log({ newvalue });

    // customerDetailsAddressGet()


  }

  const CustOnchangeInput = async (event: any, newInputValue: any) => {
    console.log({ newInputValue })

    try {
      const resp = await postData('/admin/customer-details/searchcustomer', { search: newInputValue })
      console.log({ resp })
      const filteredPatients = resp?.data?.data?.filter((patient: any) => {
        const { name, mobile } = patient;

        const nameMatches = name?.toLowerCase().startsWith(newInputValue?.toLowerCase());


        const isNumeric = !isNaN(newInputValue);
        const phoneMatches = isNumeric && mobile?.includes(newInputValue);

        return nameMatches || phoneMatches;
      });
      console.log({ filteredPatients })
      setCustArray(filteredPatients)
    } catch (err: any) {

    } finally {

    }

    //  const filteredPatients = customerListAll?.filter((patient:any) => {
    //   const { name, phonenumber } = patient;

    //   const nameMatches = name?.toLowerCase().startsWith(newInputValue?.toLowerCase());


    //   const isNumeric = !isNaN(newInputValue);
    //   const phoneMatches = isNumeric && phonenumber?.includes(newInputValue);

    //   return nameMatches || phoneMatches;
    // });




    // setCustArray(filteredPatients)




  };
  const debounceFn = useCallback(_debounce(CustOnchangeInput, 1000), []);
  const Debouncefun = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
    debounceFn(_, newInputValue)

  }


  return (
    <Box>
      <CustomBox title='Panda Coin Details'>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.email}
              fieldName="enter your email"
              placeholder={``}
              fieldLabel={"Offer Title"}
              disabled={false}
              view={false}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <Customselect
              type='text'
              control={control}
              error={errors.name}
              fieldName="enter your email"
              placeholder={``}
              fieldLabel={"Offer Type"}
              selectvalue={""}
              height={40}
              label={''}
              size={16}
              value={"category"}
              options={''}
              onChangeValue={"onChangeSelect"}
              background={'#fff'}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Customselect>
          </Grid>

          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.email}
              fieldName="Offer Value"
              placeholder={``}
              fieldLabel={"Code"}
              disabled={false}
              view={false}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.email}
              fieldName="enter your email"
              placeholder={``}
              fieldLabel={"Store Name"}
              disabled={false}
              view={false}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <CustomDatePicker
              values={''}
              changeValue={() => null}
              fieldName='pickupTime'
              control={control}
              error={errors.pickupTime}
              fieldLabel={'Expiry Date'}
            />
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.email}
              fieldName="enter your email"
              placeholder={``}
              fieldLabel={"Limitations"}
              disabled={false}
              view={false}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.4}>
            <CustomInput
              type='text'
              control={control}
              error={errors.email}
              fieldName="enter your email"
              placeholder={``}
              fieldLabel={"locality"}
              disabled={false}
              view={false}
              defaultValue={''}
            />
          </Grid>

          <Grid item xs={12} lg={2.4}>
            <Typography mt={3}></Typography>
            <CustomCheckBox isChecked={false} label='' onChange={(e: any) => null} title='Customer Specific Offer' />

          </Grid>
          <Grid item xs={12} lg={2.4}>
            <CustomSelectSearch
              isMultiple={true}
              control={control}
              error={errors.name}
              fieldName="patient"
              fieldLabel="Search Customer"
              background="#FFFFFF"
              height="40px"
              size="16px"
              options={custArray}
              getOptionLabel={({ name, mobile }: any) => `${name}  ${mobile}`}
              onChangeValue={CustmerSearch}
              inputValue={inputValue}
              placeholder='Search by Name,Mobile'
              onInputChange={Debouncefun}
            />
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <CustomTextarea

              control={control}
              error={errors.email}
              fieldName="enter your email"
              placeholder={``}
              fieldLabel={"Offer Description"}
              disabled={false}
              view={false}
              defaultValue={''}
            />
          </Grid>
        </Grid>



      </CustomBox>
      <Box py={3}>
        <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Offer'} onClick={() => null} />
      </Box>

    </Box>
  )
}

export default OfferForm
