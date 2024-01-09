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
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import moment from 'moment';

type props = {
    res?: any,
    view?: any,

}
const RateCardForm = ({ res, view }: props) => {
    const router = useRouter()
    const { id } = router.query;

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

    const orderValidation = /^[0-9]*$/
    const schema = yup
        .object()
        .shape({
            title: yup
                .string()
                .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
                .max(40)
                .required('Required'),
            rate_card_type: yup
                .string()
                .required('Required'),
            reason: yup
                .string()
                .required('Required'),
            customer_rate: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
            driver_rate: yup.string().matches(orderValidation, 'Accept only positive number').nullable().required('Required'),
            start_date_time: yup
                .string()
                .required('Required'),
            expiry_date_time: yup
                .string()
                .required('Required'),
            locality: yup
                .string()
                .required('Required'),
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
            type: process?.env?.NEXT_PUBLIC_TYPE,
        }
    });

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null)
    const [franchiseList, setFranchiseList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [type, setType] = useState<any>(null)


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
        const getsingleList = async () => {
            try {
                let response = await fetchData(`admin/rate-card/show/${id}`)
                // setEndTime(response?.data?.data?.start_date_time)
                // setStartTime(response?.data?.data?.expiry_date_time)
                let data = response?.data?.data;

                data.start_date_time = data.start_date_time ? moment(data.start_date_time, 'YYYY-MM-DD hh:mm A') : null
                data.expiry_date_time = data.expiry_date_time ? moment(data.expiry_date_time, 'YYYY-MM-DD hh:mm A') : null
                setFranchiseSelect(data?.locality?.franchise_id);
                data.locality = data?.locality?.franchise_id
                setType(data?.rate_card_type)
                reset(data)

                // reset(response?.data?.data)
            
            } catch (err: any) {
                toast.error(err?.message)
            }


        }
        if(id){
            getsingleList()
        }

    }, [id])


    useEffect(() => {
        getFranchiseList()
    }, [])

    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('locality', e.target.value)
        setError('locality', { message: '' })
        setFranchiseSelect(e.target.value)

    }

    const onchangeSelect = (e: any) => {
        const { value } = e.target;
        setType(value)
        setValue('rate_card_type', value)
        setError('rate_card_type', { message: '' })
    }


    const submitForm = async (data: any) => {
        const CREATE_URL = 'admin/rate-card/create';
        const UPDATE_URL = 'admin/rate-card/update';

        let filterResult = franchiseList?.find((res: any) => res?._id === franchiseSelect)
        let locality: any = {
            franchise_id: filterResult?._id,
            franchise_name: filterResult?.franchise_name
        }
        data.locality = locality
        data.start_date_time = moment(data.start_date_time).format('YYYY-MM-DD hh:mm')
        data.expiry_date_time = moment(data.expiry_date_time).format('YYYY-MM-DD hh:mm')
        if (res) {
            data.id = id;
        }
        try {
            await postData(res ? UPDATE_URL : CREATE_URL, { ...data })
            toast.success(res ? 'Update Successfully' : 'Created Successfully');
            router.back()

        } catch (err: any) {
            toast.error(err.message)

        } finally {

        }


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
                            view={view ? true : false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            type='text'
                            disabled={view ? true : false}
                            control={control}
                            error={errors.rate_card_type}
                            fieldName="rate_card_type"
                            placeholder={``}
                            fieldLabel={"Rate Card Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={type}
                            options={''}
                            onChangeValue={onchangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={'Normal'}>Normal</MenuItem>
                            <MenuItem value={'Surge'}>Surge</MenuItem>
                            <MenuItem value={'Rush'}>Rush</MenuItem>
                        </Customselect>

                    </Grid>
                    <Grid item xs={12} lg={2}>

                        <Customselect
                            disabled={view ? true : false}
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
                            disabled={view ? true : false}
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
                            disabled={view ? true : false}
                            values={endTime}
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
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            {!view && <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? 'Update Rate' : 'Add Rate'} onClick={handleSubmit(submitForm)} />
            </Box>}

        </Box>

    )
}

export default RateCardForm
