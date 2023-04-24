import React, { memo, useState, useEffect } from 'react'
import { Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { Content } from 'next/font/google'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInputNormal from '@/components/CustomInputNormal';
import DatePickers from '@/components/DatePickers';
import moment from 'moment'
type props = {
    content: any,
    index: number,
    setState: any,
    state: any,
    deafultCommission:string,
    onChange: any
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
    commission: any,
    fixed_delivery_price: any
}


const CustomProductVarient = memo(({ content, index, deafultCommission, onChange}: props) => {

    const { register,
        handleSubmit,
        control,
        getValues,
        formState: { errors },
        reset,
        setValue, } = useForm<Input>({
            defaultValues: content
        });


    // const onChangeSellingPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     state[index].attributs = content.split(" ")
    //     state[index].regular_price = e.target.value;
    // }

    // const onChangeOfferPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     state[index].offer_price = e.target.value;

    // }

    // const onChangePurchasePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     state[index].seller_price = e.target.value;
    // }

    // const onChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     state[index].stock_value = e.target.value;
    // }

    // const onChangeOffer_date_from = (e: any) => {
    //     setValue('offer_date_from', e)
    //     state[index].offer_date_from = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');
    // }

    // const onChangeOffer_date_to = (e: any) => {
    //     setValue('offer_date_to', e)
    //     state[index].offer_date_to = moment(e, 'DD-MM-YYYY').format('YYYY-MM-DD');

    // }
    // const onChangeCommision = (e: any) => {
    //     state[index].commission = e.target.value;

    // }
    // const onChangefixed_delivery_price = (e: any) => {
    //     state[index].fixed_delivery_price = e.target.value;
    // }

    return (
        <Box>
            <Typography py={2} sx={{ fontFamily: `'Poppins' sans-serif` }} fontSize={16} fontWeight={'bold'}>{index + 1}. {content?.title}</Typography>
            <Grid container spacing={2}>
            <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        onChangeValue={(e: any) => onChange(e.target.value, 'seller_price')}
                        disabled={false}
                        type='text'
                        error={errors.seller_price}
                        fieldName="seller_price"
                        placeholder={``}
                        fieldLabel={"Purchase Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                
                <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        disabled={false}
                        type='text'
                        error={errors.regular_price}
                        fieldName="regular_price"
                        placeholder={``}
                        onChangeValue={(e: any) => onChange(e.target.value, 'regular_price')}
                        fieldLabel={"Selling Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                
               
                <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        onChangeValue={(e: any) => onChange(e.target.value, 'commission')}
                        disabled={false}
                        type='text'
                        error={errors.commission}
                        fieldName="commission"
                        placeholder={''}
                        fieldLabel={"Commission(%)"}
                        view={false}
                        defaultValue={deafultCommission ? deafultCommission : 0}
                    />
                </Grid>
                <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        onChangeValue={(e: any) => onChange(e.target.value, 'fixed_delivery_price')}
                        disabled={false}
                        type='number'
                        error={errors.fixed_delivery_price}
                        fieldName=" fixed_delivery_price"
                        placeholder={``}
                        fieldLabel={"Fixed Delivery Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>
                <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        onChangeValue={(e: any) => onChange(e.target.value, 'offer_price')}
                        disabled={false}
                        type='text'
                        error={errors.offer_price}
                        fieldName="offer_price"
                        placeholder={``}
                        fieldLabel={"Offer Price"}
                        view={false}
                        defaultValue={''}
                    />
                </Grid>

                <Grid item lg={1.5} xs={12}>
                    < DatePickers
                        values={getValues('offer_date_from')}
                        changeValue={(e: any) => onChange(e, 'offer_date_from')}
                        fieldName='offer_date_from'
                        error={errors.offer_date_from}
                        fieldLabel={'Offer From'}
                    />
                </Grid>
                <Grid item lg={1.5} xs={12}>
                    <DatePickers
                        values={getValues('offer_date_to')}
                        changeValue={(e: any) => onChange(e, 'offer_date_to')}
                        fieldName='offer_date_to'
                        error={errors.offer_date_to}
                        fieldLabel={'Offer To'}
                    />
                </Grid>
                <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        onChangeValue={(e: any) => onChange(e.target.value, 'stock_value')}
                        disabled={false}
                        type='text'
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
