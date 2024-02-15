import { Box, Grid, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Custombutton from '@/components/Custombutton';

import CustomTextarea from '@/components/CustomTextarea';
import CustomTimepicker from '@/components/CustomTimepicker';
import { useRouter } from 'next/router';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import Customselect from '@/components/Customselect';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';
import moment from 'moment';

type props = {
    res?: any,
    view?: any,

}
type IFormInput = {
    message: string,
    type: string,
    start_date_time: string,
    end_date_time: string,
    franchise: string
}
const RushHourForm = ({ res, view }: props) => {
    const router = useRouter()
    const { id }:any = router.query;




    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null)
    const [franchiseList, setFranchiseList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [type, setType] = useState<any>(null)



    const orderValidation = /^[0-9]*$/
    const schema = yup
        .object()
        .shape({
            message: yup
                .string()
                .required('Required'),

            start_date_time: yup
                .string()
                .required('Required'),
            end_date_time: yup
                .string()
                .required('Required'),
            franchise: yup
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


    useEffect(() => {
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
        getFranchiseList()
    }, [])

    useEffect(() => {
        const getsingleList = async () => {
            try {
                let response = await fetchData(`admin/rush-hour/${id}`)
                let data = response?.data?.data;
                data.start_date_time = data.start_date_time ? moment(data.start_date_time, 'YYYY-MM-DD hh:mm A') : null
                data.end_date_time = data.end_date_time ? moment(data.end_date_time, 'YYYY-MM-DD hh:mm A') : null
                setFranchiseSelect(data?.franchisee?._id);
                data.locality = data?.franchisee?._id
          
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


    class dateFilter {
        static StartDate(value: any) {
            setValue('start_date_time', value)
            setStartTime(value)
            setError('start_date_time', { message: "" })

        }
        static EndDate(value: any) {
            setValue('end_date_time', value)
            setEndTime(value)
            setError('end_date_time', { message: "" })
        }
    }


    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {


        const { value } = e.target;
        console.log({ value })
        setValue('franchise', value)
        setError('franchise', { message: '' })
        setFranchiseSelect(value)

    }

    const submitForm = async (data: any) => {
        console.log({ data })
        const CREATE_URL = 'admin/rush-hour/create';
        const UPDATE_URL = 'admin/rush-hour/update';

        let filterResult = franchiseList?.find((res: any) => res?._id === franchiseSelect)
        let locality: any = {
            franchise_id: filterResult?._id,
            franchise_name: filterResult?.franchise_name
        }
        data.locality = locality
        data.start_date_time = moment(data.start_date_time).format('YYYY-MM-DD hh:mm A')
        data.end_date_time = moment(data.end_date_time).format('YYYY-MM-DD hh:mm A')
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
            <CustomBox title='Add Rush Hour'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
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
                    <Grid item xs={12} lg={3}>
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
                    <Grid item xs={12} lg={3}>
                        <CustomDateTimePicker
                            disabled={view ? true : false}
                            values={endTime}
                            changeValue={(value: any) => dateFilter.EndDate(value)}
                            fieldName='end_date_time'
                            control={control}
                            error={errors.end_date_time}
                            fieldLabel={'Expiry Date & Time'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomTextarea
                            control={control}
                            error={errors.message}
                            fieldName="message"
                            placeholder={``}
                            fieldLabel={"Message"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
            {!view && <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? 'Update Message' : 'Add Message'} onClick={handleSubmit(submitForm)} />
            </Box>}

        </Box>
    )
}

export default RushHourForm
