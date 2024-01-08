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
import { toast } from 'react-toastify';
import _ from 'lodash';
import { fetchData, postData } from '@/CustomAxios';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import moment from 'moment';
import { useRouter } from 'next/router';
import CustomImageUploader from '@/components/CustomImageUploader';
import { IMAGE_URL } from '@/Config';



type props = {
  res?: any,
  view?: any,

}

const OfferForm = ({ res, view }: props) => {
  const router = useRouter()
  const { id } = router.query;

  type IFormInput = {
    offer_title: string,
    offer_type: string,
    offer_value: string,
    store: any,
    expiry_date: any,
    limitation: any,
    franchise: any,
    offer_description: string,
    customer_specific_offer: boolean,
    image: any,
    customers: any,
    type: string,
    customer: any
  }


  const [singleList, setSingleList] = useState<any>([])
  const [inputValue, setInputValue] = useState<any>('');
  const [custArray, setCustArray] = useState([])
  const [type, setType] = useState<string | null>(null);
  const [franchiseList, setFranchiseList] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
  const [vendorList, setVendorList] = useState<any>([])
  const [vendorSelect, setvendorSelect] = useState<any>(null);
  const [discount, setDiscount] = useState<null | string>(null)
  const [time, setTime] = useState<any>(null);
  const [dataa, setDataa] = useState<any>('');
  const [checkbox, setCheckBox] = useState<any>(false);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [thumbnailPreview, setthumbnailPreview] = useState<any>(null);
  const [imagefile, setImagefile] = useState<null | File>(null)

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        // You can perform asynchronous operations here based on the id
        // For example, make an API call or fetch data
        const response = await fetchData(`admin/offers/show/${id}`);
        const resp = await fetchData(`admin/vendor-list/${response?.data?.data?.franchise}/${process.env.NEXT_PUBLIC_TYPE}`)
        setVendorList(resp?.data?.data)
        setSingleList(response?.data?.data);
        setImagePreview(`${IMAGE_URL}${response?.data?.data?.image}`)
        setDiscount(response?.data?.data?.offer_type)
        setvendorSelect(response?.data?.data?.store)
        setFranchiseSelect(response?.data?.data?.franchise)
        setCheckBox(response?.data?.data?.customer_specific_offer === "false" ? false : true)

        let data = response?.data?.data;
        console.log({ data })
        data.expiry_date = data.expiry_date ? moment(data.expiry_date, 'YYYY-MM-DD hh:mm A') : null

        reset(data)

        // Do something with the data

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (id) {

      fetchDatas()
    }
  }, [id])


  const orderValidation = /^[0-9]*$/
  const schema = yup
    .object()
    .shape({
      offer_title: yup
        .string()
        .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
        .max(40)
        .required('Required'),
      offer_type: yup
        .string().required('Required'),
      offer_value: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
      store: yup
        .string().required('Required'),
      franchise: yup
        .string().required('Required'),
      limitation: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
      // offer_description: yup
      //   .string().required('Required'),
      expiry_date: yup
        .string().required('Required'),
      image: yup
        .string().required('Required'),
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
          customers: [],
          customer_specific_offer: false,
          type: process?.env?.NEXT_PUBLIC_TYPE,
        }
      }
    );

  const CustmerSearch = (value: any, newvalue: any) => {
    setDataa(newvalue)



    setValue('customers', newvalue?.map((res: any) => ({
      "id": res?.user_id,
      "name": res?.name,
      "mobile": res?.mobile
    })) || []);

    // customerDetailsAddressGet()


  }

  const CustOnchangeInput = async (event: any, newInputValue: any) => {


    try {
      const resp = await postData('/admin/customer-details/searchcustomer', { search: newInputValue })
      console.log({ resp })
      const filteredCust = resp?.data?.data?.filter((patient: any) => {
        const { name, mobile } = patient;

        const nameMatches = name?.toLowerCase().startsWith(newInputValue?.toLowerCase());


        const isNumeric = !isNaN(newInputValue);
        const phoneMatches = isNumeric && mobile?.includes(newInputValue);

        return nameMatches || phoneMatches;
      });

      setCustArray(filteredCust)
    } catch (err: any) {

    } finally {

    }
  };


  const debounceFn = useCallback(_debounce(CustOnchangeInput, 1000), []);
  const Debouncefun = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
    debounceFn(_, newInputValue)

  }

  const onSelectDiscountType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(e.target.value)
    setValue('offer_type', e.target.value)
    setError('offer_type', { message: '' })
  }


  const getFranchiseList = async () => {
    try {
      setLoading(true)
      const response = await fetchData('/admin/franchise/list')
      setFranchiseList(response?.data?.data)

    } catch (err: any) {
      toast.error(err?.message)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    getFranchiseList()
  }, [])

  
  const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('franchise', e.target?.value)
    setValue('store', null)
    setError('franchise', { message: '' })
    setFranchiseSelect(e.target.value)
    try {
      setLoading(true)
      setvendorSelect(null)
      const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)
      setVendorList(response?.data?.data)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    } finally {
      setLoading(false)

    }


  }

  const onSelectStore = (e: React.ChangeEvent<HTMLInputElement>) => {
    setvendorSelect(e.target.value)
    setValue('store', e.target.value)
    setError('store', { message: '' })
  }

  const OnChangeDate = (value: any) => {
    setValue('expiry_date', value)
    setTime(value)
    setError('expiry_date', { message: "" })
  }


  const onChangeCheck = (e: any) => {
    if (view) return false;
    setValue('customer_specific_offer', e)
    setCheckBox(e)
  }


  const imageUploder = async (file: any) => {
    if (file.size <= 1000000) {
      setImagefile(file)
      setImagePreview(null)
      setValue('image', file)
      setError('image', { message: '' })
    } else {
      setImagePreview(null)
      setImagefile(null)
      toast.warning('Image should be less than or equal 1MB')
    }


  }



  const handleSubmitForm = async (data: any) => {

    data.customers = JSON.stringify(data?.customers);
    const CreateURL = 'admin/offers/create'
    const EditUrl = 'admin/offers/update'
    if (res) {
      data.id = id;
    }
    if (imagefile) {
      data.image = imagefile;
    } else {
      delete data.image
    }
    data.expiry_date = moment(data.expiry_date).format('YYYY-MM-DD hh:mm')

    let formData = new FormData();


    Object.entries(data).forEach(([key, value]: any) => {
      formData.append(key, value);
    });



    try {
      setLoading(true)
      await postData(res ? EditUrl : CreateURL, formData);
      toast.success(res ? 'Updated Successfully' : 'Created Successfully');
      router.push('/offers')
      reset();
    } catch (err: any) {
      toast.error(err.message)

    } finally {
      setLoading(false)
    }


  }



  return (
    <Box>
      <CustomBox title='Panda Coin Details'>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2.5}>
            <CustomInput
              type='text'
              control={control}
              error={errors.offer_title}
              fieldName="offer_title"
              placeholder={``}
              fieldLabel={"Offer Title"}
              disabled={false}
              view={view ? true : false}
              defaultValue={''}
            />
          </Grid>
          <Grid item xs={12} lg={2.5}>
            <Customselect
              type='text'
              control={control}
              error={errors.offer_type}
              fieldName="offer_type"
              placeholder={``}
              fieldLabel={"Offer Type"}
              selectvalue={""}
              height={40}
              label={''}
              size={16}
              value={discount}
              options={''}
              onChangeValue={onSelectDiscountType}
              background={'#fff'}
            >
              <MenuItem value={'percentage'}>Percentage</MenuItem>
              <MenuItem value={'flat'}>Flat</MenuItem>
            </Customselect>
          </Grid>

          <Grid item xs={12} lg={2.5}>
            <CustomInput
              type='text'
              control={control}
              error={errors.offer_value}
              fieldName="offer_value"
              placeholder={``}
              fieldLabel={"Offer Value"}
              disabled={false}
              view={view ? true : false}
              defaultValue={''}
            />
          </Grid>
          {!res &&
            <Grid item xs={12} lg={2.5}>
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
            </Grid>}
          {!res &&
            <Grid item xs={12} lg={2.5}>
              <Customselect
                disabled={view ? true : false}
                type='text'
                control={control}
                error={errors.store}
                fieldName="store"
                placeholder={``}
                fieldLabel={"Store"}
                selectvalue={""}
                height={40}
                label={''}
                size={16}
                value={vendorSelect}
                options={''}
                onChangeValue={onSelectStore}
                background={'#fff'}
              >
                <MenuItem value="" disabled >
                  <>Select Store</>
                </MenuItem>
                {vendorList && vendorList.map((res: any) => (
                  <MenuItem value={res?._id}>{res?.store_name}</MenuItem>
                ))}
              </Customselect>
            </Grid>}
          <Grid item xs={12} lg={2.5}>
            <CustomDateTimePicker
              disabled={view ? true : false}
              values={time}
              changeValue={(value: any) => OnChangeDate(value)}
              fieldName='expiry_date'
              control={control}
              error={errors.expiry_date}
              fieldLabel={'Expiry Date & Time'}
            />
          </Grid>
          <Grid item xs={12} lg={2.5}>
            <CustomInput
              type='text'
              control={control}
              error={errors.limitation}
              fieldName="limitation"
              placeholder={``}
              fieldLabel={"Limitations"}
              disabled={false}
              view={view ? true : false}
              defaultValue={''}
            />
          </Grid>


          {!res && <Grid item xs={12} lg={2.5}>
            <Typography mt={3}></Typography>
            <CustomCheckBox isChecked={checkbox} label='' onChange={onChangeCheck} title='Customer Specific Offer' />

          </Grid>}


        {(checkbox && view)&&<Grid item xs={12} lg={2.5}>
            <CustomTextarea
              control={control}
              error={errors.customer}
              fieldName="customer"
              placeholder={``}
              fieldLabel={"customers"}
              disabled={false}
              view={view ? true : false}
              defaultValue={singleList?.customers?.map((res: any) => res?.name)?.join()}
            />
          </Grid>}
          {(checkbox && !res && !view) &&
            <Grid item xs={12} lg={2.5}>
              <CustomSelectSearch
                isMultiple={true}
                control={control}
                error={errors.customers}
                fieldName="customers"
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
            </Grid>}
          <Grid item xs={12} lg={2.5}>
            <CustomImageUploader
              ICON={""}
              viewImage={imagePreview}
              error={errors.image}
              fieldName="image"
              placeholder={``}
              fieldLabel={"Offer Image"}
              control={control}
              height={130}
              max={5}
              onChangeValue={imageUploder}
              preview={imagefile}
              previewEditimage={""}
              type={"file"}
              background="#e7f5f7"
              myid="contained-button-file"
              width={"100%"}
            />
          </Grid>
          <Grid item xs={12} lg={4} xl={4}>
            <CustomTextarea
              control={control}
              error={errors.offer_description}
              fieldName="offer_description"
              placeholder={``}
              fieldLabel={"Offer Description"}
              disabled={false}
              view={view ? true : false}
              defaultValue={''}
            />
          </Grid>
        </Grid>



      </CustomBox>
      {!view &&
        <Box py={3}>
          <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? 'Edit Offer' : 'Add Offer'}
            onClick={handleSubmit(handleSubmitForm)} />
        </Box>}

    </Box>
  )
}

export default OfferForm
