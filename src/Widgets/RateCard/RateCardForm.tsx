import CustomInput from '@/components/CustomInput'
import { Box, Grid, MenuItem } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import CustomTextarea from '@/components/CustomTextarea';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
const RateCardForm = () => {


    type IFormInput = {
        title: string,
        type: string,
        rate_card_type: string,
        reason: string,
        customer_rate: string,
        driver_rate: string,
        start_date_time: string,
        expiry_date_time: string,
        locality: string


    }
    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<IFormInput>();

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null)
    const [franchiseList, setFranchiseList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);


    class dateFilter {
        static StartDate(value: any) {
            setValue('start_date_time', value)
            setStartTime(value)
            setError('start_date_time', { message: "" })

        }
        static EndDate(value: any) {
            setValue('expiry_date_time', value)
            setEndTime(value)
            setError('expiry_date_time', { message: "" })
        }
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
        setValue('locality', e.target?.value)
        setError('locality', { message: '' })
        setFranchiseSelect(e.target.value)
       
      }


    return (
        <Box>
            <CustomBox title='Add Rate'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.title}
                            fieldName="title"
                            placeholder={``}
                            fieldLabel={"Title"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.rate_card_type}
                            fieldName="rate_card_type"
                            placeholder={``}
                            fieldLabel={"Rate Card Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={"category"}
                            options={''}
                            onChangeValue={"onChangeSelect"}
                            background={'#fff'}
                        >
                            <MenuItem value={'Normal'}>Normal</MenuItem>
                            <MenuItem value={'Surge'}>Surge</MenuItem>
                            <MenuItem value={'Rush'}>Rush</MenuItem>
                        </Customselect>

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.locality}
                                fieldName="locality"
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
                        <CustomDateTimePicker
                            disabled={false}
                            values={startTime}
                            changeValue={(value: any) => dateFilter.StartDate(value)}
                            fieldName='start_date_time'
                            control={control}
                            error={errors.start_date_time}
                            fieldLabel={'Start Date & Time'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomDateTimePicker
                            disabled={false}
                            values={startTime}
                            changeValue={(value: any) => dateFilter.EndDate(value)}
                            fieldName='expiry_date_time'
                            control={control}
                            error={errors.expiry_date_time}
                            fieldLabel={'Expiry Date & Time'}
                        />
                    </Grid>


                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_rate}
                            fieldName="customer_rate"
                            placeholder={``}
                            fieldLabel={"Customer Rate"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.driver_rate}
                            fieldName="driver_rate"
                            placeholder={``}
                            fieldLabel={"Driver Rate"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={4.5}>
                        <CustomTextarea
                            control={control}
                            error={errors.reason}
                            fieldName="reason"
                            placeholder={``}
                            fieldLabel={"Reason"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Rate'} onClick={() => null} />
            </Box>

        </Box>

    )
}

export default RateCardForm
