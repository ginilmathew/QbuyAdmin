import React, { useEffect, useState } from 'react'
import { Box, Grid, MenuItem } from '@mui/material'

import CustomBox from '../CustomBox'
import { useForm } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';

import Custombutton from '@/components/Custombutton';

import CustomTextarea from '@/components/CustomTextarea';
import CustomTimepicker from '@/components/CustomTimepicker';
import Customselect from '@/components/Customselect';
import { useRouter } from 'next/router';
import { fetchData, postData } from '@/CustomAxios';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import CustomTable from '@/components/CustomTable';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

type props = {
    res?: any
    view?: any
}

const RiderTicketForm = ({ res, view }: props) => {
    const router = useRouter()
    const { id } = router.query;


    const [statusList, setStatus] = useState<any>(null)
    const [statusSelect, setStatusSelect] = useState(null)
    const [loading, setloading] = useState(false)
    const [commentsList, setCommentsList] = useState<any>([])

    type IFormInput = {
        name: string,
        mobile: string,
        franchise: string,
        description: string,
        status: any,
        comments: string,
        subject: string
    }



    const schema = yup
        .object()
        .shape({
            status: yup.string().required('Required'),
            comments: yup.string().matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name').required('Required')
        })

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<IFormInput>({
            resolver: yupResolver(schema)
        });


    const onChangeSelect = (e: any) => {
        const { value } = e.target;
        setStatusSelect(value)
        setValue('status', value)
        setError('status', { message: '' })
    }



    useEffect(() => {
        const getStatus = async () => {
            try {
                const respList = await postData('admin/ticket/show', { _id: id })
                const resp = await fetchData('admin/ticket/status');
                setValue('name', respList?.data?.data?.rider?.name)
                setValue('mobile', respList?.data?.data?.rider?.mobile)
                setValue('franchise', respList?.data?.data?.rider?.primary_franchise?.franchise_name)
                setValue('subject', respList?.data?.data?.subject)
                setCommentsList(respList?.data?.data?.comments)
                setValue('status', respList?.data?.data?.status_id)
                setStatusSelect(respList?.data?.data?.status_id)
                setStatus(resp?.data?.data)

            } catch (err: any) {

            } finally {

            }

        }

        getStatus()
    }, [])


    const submit = async (data: any) => {
        let pass = {
            _id: id,
            status: data?.status * 1,
            comment: data?.comments
        }

        try {
            setloading(true)
            await postData('admin/ticket/update', { ...pass })
            toast.success('Updated Successfully');
            // router.push('/riderTickets')
            router.back();

        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setloading(false)
        }

    }


    const columns: GridColDef[] = [
        {
            field: 'Created Date',
            headerName: 'Created Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'offer_title',
            headerName: 'User',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.name,
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },



    ];


    return (
        <Box>
            <CustomBox title='Rider Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Rider Name"}
                            disabled={true}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Phone number"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise}
                            fieldName="franchise"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextarea
                            control={control}
                            error={errors.subject}
                            fieldName="subject"
                            placeholder={``}
                            fieldLabel={"Subject"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomTextarea
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Rider Description"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.status}
                            fieldName="status"
                            placeholder={``}
                            fieldLabel={"Status"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={statusSelect}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Status</>
                            </MenuItem>
                            {statusList && statusList?.map((res: any) => (
                                <MenuItem value={res?.status_id}>{res?.status}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    {res &&
                    <Grid item xs={12} lg={4}>
                        <CustomTextarea
                            control={control}
                            error={errors.comments}
                            fieldName="comments"
                            placeholder={``}
                            fieldLabel={"Comments"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>}
                </Grid> 

                {res &&<Box py={3} display={'flex'} justifyContent={'flex-end'}>
                    <Custombutton
                        btncolor=''
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={'Update Status'}
                        onClick={handleSubmit(submit)}
                        disabled={loading}
                    />
                </Box> }

            </CustomBox>

            <CustomBox title='comments'>

                {(res || view) && <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={commentsList} id={"_id"} bg={"#ffff"} label='Comments List' />
                </Box>}

            </CustomBox>
        </Box>
    )
}

export default RiderTicketForm