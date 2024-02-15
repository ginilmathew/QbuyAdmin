import { Box, Grid, MenuItem } from '@mui/material'
import React, { useEffect, useReducer } from 'react'
import CustomBox from '../CustomBox'

import Customselect from '@/components/Customselect'
import { useRouter } from 'next/router';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import moment from 'moment';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTimepicker from '@/components/CustomTimepicker';
import Custombutton from '@/components/Custombutton';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';

type IFormInput = {
    extra_charge_id: any,
    type: string,
    label1: any,
    label2: any,
    franchise: any,
    charge: string,
    expiry_date_time: any
}
type props = {
    res?: any
    view?: any
}

const AddExtraChargevalue = ({ view, res }: props) => {
    const router = useRouter()
    const { id } = router.query;

    const [task, UpdateTask] = useReducer((prev: any, next: any) => ({
        ...prev, ...next
    }), {
        extraChargeType: null,
        extraChargeSelect: null,
        franchiseSelect: null,
        label1: null,
        label2: null,
        franchiseList: [],
        extraChargeList: [],
        fromDate: null,
        toDate: null,
        expiry_date_time: null
    })

    let valiation1 = {
        extra_charge_id: yup.string().required('Required'),
        charge: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
        franchise: yup.string().required('Required'),
    
        label1: yup.string().required('Required'),
        label2: yup.string()
            .required('Required'),
        // If selectType is not 'text', label2 is required
        type: yup.string().required('Required'),
    }
    let valiation2 = {
        
        label1: yup.string().required('Required'),
        extra_charge_id: yup.string().required('Required'),
        charge: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
        franchise: yup.string().required('Required'),
        expiry_date_time: yup.string().required('Required'),
        // If selectType is not 'text', label2 is require
        type: yup.string().required('Required'),
    }






    const schema = yup
        .object()
        .shape(task.extraChargeType === "text" ? valiation2 : valiation1)
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
        const getList = async () => {
            try {
                const resp = await fetchData('admin/extra-charge/list');
                const response = await fetchData('/admin/franchise/list');
                UpdateTask({
                    extraChargeList: resp?.data?.data,
                    franchiseList: response?.data?.data
                })

            } catch (err: any) {
                toast.error(err?.messsage);
            }
        }
        getList()

    }, [])



    useEffect(() => {
        if (id) {
            const getSingleList = async () => {
                try {
                    const resp = await fetchData(`admin/extra-charge-value/show/${id}`)

                    const data = resp?.data?.data;
                
                    setValue('charge', resp?.data?.data?.charge);
                    setValue('franchise', data?.franchise?.franchise_id)
                    setValue('extra_charge_id', data?.extra_charge_id?.extra_charge_id)
                    setValue('type', data?.type)
                   
                    if (data?.type === "dateRange") {
                        setValue('label1', data.label1 ? moment(data.label1, 'YYYY-MM-DD') : null)
                        setValue('label2', data.label2 ? moment(data.label2, 'YYYY-MM-DD') : null)
                    }
                    if (data?.type === "timeRange") {
                        setValue('label1', data.label1 ? moment(data.label1, 'hh:mm A') : null)
                        setValue('label2', data.label2 ? moment(data.label2, 'hh:mm A') : null)
                        setValue('expiry_date_time', data.expiry_date_time ? moment(data.expiry_date_time, 'YYYY-MM-DD') : null);
                    }
                    if (data?.type === 'text') {
                        setValue('label1', data.label1 ? data.label1 : null)
                        setValue('label2', data.label2 ? data.label2 : null)
                    }
                    UpdateTask({
                        extraChargeSelect: data?.extra_charge_id?.extra_charge_id,
                        franchiseSelect: data?.franchise?.franchise_id,
                        extraChargeType: data?.type,
                        label1: data?.extra_charge_id?.label1,
                        label2: data?.extra_charge_id?.label2,
                    })
                } catch (err: any) {
                    toast.error(err?.messsage);

                } finally {

                }
            }

            getSingleList()
        }

    }, [id])

    const selectExtraCharge = (e: any) => {
        const { value } = e.target;
        const { label1, label2, type } = task?.extraChargeList?.find((res: any) => res?.extra_charge_id === value);
        setValue('extra_charge_id', value)
        setValue('type', type)
        UpdateTask({
            label1: label1,
            label2: label2,
            extraChargeType: type,
            extraChargeSelect: value,

        })
        setError('extra_charge_id', { message: "" })
    }

    const selectFranchisChange = (e: any) => {
        const { value } = e.target;
        setValue('franchise', value)
        UpdateTask({
            franchiseSelect: value,
        })
        setError('franchise', { message: "" })
    }

    class DateFilter {
        static startDate(value: any) {
            // let val = moment(value).format('YYYY-MM-DD')
            setValue('label1', value)
            UpdateTask({
                fromDate: value
            })
            setError('label1', { message: "" })
        }

        static endDate(value: any) {
            // let val = moment(value).format('YYYY-MM-DD')
            setValue('label2', value)
            UpdateTask({
                toDate: value
            })
            setError('label2', { message: "" })
        }
    }

    class TimeFilter {
        static startTime(value: any) {
            // let val = moment(value).format('hh:mm A')
            setValue('label1', value)
            setError('label1', { message: "" })
        }
        static endTime(value: any) {
            // let val = moment(value).format('hh:mm A')
            setValue('label2', value)
            setError('label2', { message: "" })

        }
    }

    class dateFilter {
        static expirary(value: any) {
            setValue('expiry_date_time', value)
            UpdateTask({ expiry_date_time: value })
            setError('expiry_date_time', { message: "" })

        }

    }


    const Submit = async (data: any) => {

        let { _id: franchise_id, franchise_name } = task?.franchiseList?.find((res: any) => res?._id === task?.franchiseSelect);
        const { extra_charge_id, name: extra_charge_name, label1, label2, } = task?.extraChargeList?.find((res: any) => res?.extra_charge_id === task?.extraChargeSelect);
        data.franchise = { franchise_id, franchise_name }
       
        if (data?.type === 'dateRange') {
            data.label1 = data.label1 ? moment(data.label1).format('YYYY-MM-DD') : null
            data.label2 = data.label2 ? moment(data.label2).format('YYYY-MM-DD') : null
        }
        if (data?.type === 'timeRange') {
            data.label1 = data.label1 ? moment(data.label1).format('hh:mm A') : null
            data.label2 = data.label2 ? moment(data.label2).format('hh:mm A') : null
            data.expiry_date_time = moment(data.expiry_date_time).format('YYYY-MM-DD');
        }

        data.extra_charge_id = { extra_charge_id, extra_charge_name, label1, label2 }
        if (id) {
            data.id = id;
        }



        const CREATE = 'admin/extra-charge-value/create'
        const UPDATE = 'admin/extra-charge-value/update'
        try {

            await postData(res ? UPDATE : CREATE, data)
            toast.success(res ? "Updated Successfully" : "Created Successfully");
            router.back()

        } catch (err: any) {
            toast.error(err?.messsage);
        } finally {

        }
    }


    return (
        <Box>
            <CustomBox title='Add Extra ExtraCharge'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.extra_charge_id}
                            fieldName="extra_charge_id"
                            placeholder={``}
                            fieldLabel={"Extra Charge"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={task.extraChargeSelect}
                            options={''}
                            onChangeValue={selectExtraCharge}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Extra Charge Value  </>
                            </MenuItem>
                            {task?.extraChargeList?.map((res: any) => (
                                <MenuItem value={res?.extra_charge_id}>{res?.type}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
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
                            value={task.franchiseSelect}
                            options={''}
                            onChangeValue={selectFranchisChange}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Franchise</>
                            </MenuItem>
                            {task?.franchiseList?.map((res: any) => (
                                <MenuItem value={res?._id}>{res?.franchise_name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    {task?.extraChargeType === 'dateRange' &&
                        <Grid item xs={12} lg={2}>

                            <CustomDatePicker
                                fieldName={"label1"}
                                control={control}
                                error={errors?.label1}
                                past={true}
                                fieldLabel={task?.label1}
                                values={task.fromDate}
                                changeValue={(date) => DateFilter.startDate(date)} />
                        </Grid>}
                    {task?.extraChargeType === 'dateRange' &&
                        <Grid item xs={12} lg={2}>
                            <CustomDatePicker
                                fieldName={"label2"}
                                control={control}
                                error={errors?.label2}
                                past={true}
                                fieldLabel={task?.label2}
                                values={task.toDate}
                                changeValue={(date) => DateFilter.endDate(date)} />
                        </Grid>}
                    {task.extraChargeType === 'timeRange' &&
                        <Grid item xs={12} lg={2}>
                            <CustomTimepicker
                                changeValue={(data) => TimeFilter.startTime(data)}
                                fieldName={"lable1"}
                                control={control}
                                disabled={false}
                                error={errors.label1}
                                fieldLabel={task?.label1} />
                        </Grid>}
                    {task.extraChargeType === 'timeRange' &&
                        <Grid item xs={12} lg={2}>
                            <CustomTimepicker
                                changeValue={(data) => TimeFilter.endTime(data)}
                                fieldName={"label2"}
                                control={control}
                                disabled={false}
                                error={errors.label2}
                                fieldLabel={task?.label2} />
                        </Grid>}
                    {task.extraChargeType === "text" &&
                        <Grid item xs={12} lg={2}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.label1}
                                fieldName={"label1"}
                                placeholder={``}
                                fieldLabel={"Text"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>}
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.charge}
                            fieldName="charge"
                            placeholder={``}
                            fieldLabel={"Charge"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                  {task.extraChargeType === 'timeRange' && <Grid item xs={12} lg={2}>
                        <CustomDatePicker
                            fieldName={"expiry_date_time"}
                            control={control}
                            error={errors?.expiry_date_time}
                            past={true}
                            fieldLabel={'Expiry Date'}
                            values={task.toDate}
                            // changeValue={(date) => DateFilter.endDate(date)} 
                            changeValue={(value: any) => dateFilter.expirary(value)}
                        />
                        {/* <CustomDateTimePicker
                            disabled={false}
                            values={task.expiry_date_time}
                            changeValue={(value: any) => dateFilter.expirary(value)}
                            fieldName='expiry_date_time'
                            control={control}
                            error={errors.expiry_date_time}
                            fieldLabel={'Expiry Date & Time'}
                        /> */}
                    </Grid>}
                </Grid>
            </CustomBox>
            {!view && <Box py={3}>
                <Custombutton
                    btncolor=""
                    IconEnd={""}
                    IconStart={""}
                    endIcon={false}
                    startIcon={false}
                    height={""}
                    label={res ? 'Update' : 'Add Charge'}
                    onClick={handleSubmit(Submit)}
                />
            </Box>}
        </Box>
    )
}

export default AddExtraChargevalue