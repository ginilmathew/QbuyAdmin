import React, { memo, useState, useEffect } from 'react'
import { Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { Content } from 'next/font/google'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import CustomDatePicker from '@/components/CustomDatePicker';
import moment from 'moment'
type props = {
    content: string,
    index: number,
    setState: any,
    state: any
}

type Input = {
    regular_price: any,
    seller_price: any,
    offer_price: any,
    offer_date: any,
    variant: boolean,
    offer_date_from: any,
    offer_date_to: any,
    stock_value: string,
}


const CustomProductVarient = memo(({ content, index, setState, state }: props) => {



    const { register,
        handleSubmit,
        control,
        getValues,
        formState: { errors },
        reset,
        setValue, } = useForm<Input>();


    const onChangeSellingPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        state[index].attributs = content.split(" ")
        state[index].seller_price = e.target.value;
    }

    const onChangeOfferPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        state[index].offer_price = e.target.value;

    }

    const onChangePurchasePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        state[index].regular_price = e.target.value;
    }

    const onChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
        state[index].stock_value = e.target.value;
    }

    const onChangeOffer_date_from = (e: any) => {
        setValue('offer_date_from', e)
        state[index].offer_date_from = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }

    const onChangeOffer_date_to = (e: any) => {
        setValue('offer_date_to', e)
        state[index].offer_date_to = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');

    }

    return (
        <Box>
            <Typography py={2} sx={{ fontFamily: `'Poppins' sans-serif` }} fontSize={16} fontWeight={'bold'}>{index + 1}. {content}</Typography>
            <Grid container spacing={2}>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.seller_price}
                        fieldName="seller_price"
                        placeholder={``}
                        onChangeValue={onChangeSellingPrice}
                        fieldLabel={"Selling Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        onChangeValue={onChangePurchasePrice}
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.regular_price}
                        fieldName="regular_price"
                        placeholder={``}
                        fieldLabel={"Purchase Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        onChangeValue={onChangeOfferPrice}
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.offer_price}
                        fieldName="offer_price"
                        placeholder={``}
                        fieldLabel={"Offer Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                

                <Grid item lg={2} xs={12}>
                    < CustomDatePicker
                        values={getValues('offer_date_from')}
                        changeValue={onChangeOffer_date_from}
                        fieldName='offer_date_from'
                        control={control}
                        error={errors.offer_date_from}
                        fieldLabel={'Offer From'}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomDatePicker
                        values={getValues('offer_date_to')}
                        changeValue={onChangeOffer_date_to}
                        fieldName='offer_date_to'
                        control={control}
                        error={errors.offer_date_to}
                        fieldLabel={'Offer To'}
                    />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <CustomInput
                        onChangeValue={onChangeStock}
                        disabled={false}
                        type='text'
                        control={control}
                        error={errors.stock_value}
                        fieldName="stock_value"
                        placeholder={``}
                        fieldLabel={"Stock"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
            </Grid>
        </Box>
    )
})

export default CustomProductVarient
