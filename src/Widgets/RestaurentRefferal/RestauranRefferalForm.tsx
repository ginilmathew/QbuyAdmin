import { fetchData } from '@/CustomAxios'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTextarea from '@/components/CustomTextarea'
import CustomTable from '@/components/CustomTable'


type IFormInput = {
    city: any,
    comments: string,
    location: any,
    mobile: any,
    name: any,
    restaurant_name: string,
    referral_restaurant_id: any,

}

const RestauranRefferalForm = () => {
    const router = useRouter()
    const { id } = router.query



    const schema = yup
        .object()
        .shape({})
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
                const resp = await fetchData(`admin/referral-restaurant/show/${id}`);
                let data = resp?.data?.data;
                reset(data)
            } catch (err: any) {
                toast.error(err.message)

            } finally {

            }
        }
        getList()

    }, [])


    return (
        <Box>
            <CustomBox title='Refferal Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName={"name"}
                            placeholder={``}
                            fieldLabel={"name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName={"mobile"}
                            placeholder={``}
                            fieldLabel={"Phone Number"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.referral_restaurant_id}
                            fieldName={"referral_restaurant_id"}
                            placeholder={``}
                            fieldLabel={"Restaurant ID"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.restaurant_name}
                            fieldName={"restaurant_name"}
                            placeholder={``}
                            fieldLabel={"Restaurant Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.city}
                            fieldName={"city"}
                            placeholder={``}
                            fieldLabel={"City"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.location}
                            fieldName={"location"}
                            placeholder={``}
                            fieldLabel={"Location"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomTextarea
                            // type='text'
                            control={control}
                            error={errors.comments}
                            fieldName="comments"
                            placeholder={``}
                            fieldLabel={"Comments"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
        </Box >
    )
}

export default RestauranRefferalForm