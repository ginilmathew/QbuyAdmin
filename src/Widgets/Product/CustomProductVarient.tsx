import React from 'react'
import { Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { Content } from 'next/font/google'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
type props = {
    content: string,
    index:number
}



const CustomProductVarient = ({ content,index }: props) => {

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();

    return (
        <Box>
            <Typography py={2} sx={{ fontFamily: `'Poppins' sans-serif`}} fontSize={16} fontWeight={'bold'}>{index}. {content}</Typography>
            <Grid container spacing={2}>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.product_offer}
                        fieldName="product_offer"
                        placeholder={``}
                        fieldLabel={"Selling Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.product_offer}
                        fieldName="product_offer"
                        placeholder={``}
                        fieldLabel={"Offer Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.product_offer}
                        fieldName="product_offer"
                        placeholder={``}
                        fieldLabel={"Purchase Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>

                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.product_offer}
                        fieldName="product_offer"
                        placeholder={``}
                        fieldLabel={"Offer From"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.product_offer}
                        fieldName="product_offer"
                        placeholder={``}
                        fieldLabel={"Offer To"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.product_offer}
                        fieldName="product_offer"
                        placeholder={``}
                        fieldLabel={"Stock"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default CustomProductVarient
