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
    deafultCommission: string,
    onChange: any,
    view?: any,
    stock: boolean
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


const CustomProductVarient = memo(({ content, index, deafultCommission, onChange, state, view, stock }: props) => {

    console.log({ state })

    const { register,
        handleSubmit,
        control,
        getValues,
        formState: { errors },
        reset,
        setValue, } = useForm<Input>({
            defaultValues: content
        });


console.log({state:state?.[index]})

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
                        view={view ? true : false}
                        defaultValue={state[index]?.seller_price}
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
                        view={view ? true : false}
                        defaultValue={state[index]?.regular_price}
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
                        view={view ? true : false}
                        defaultValue={state[index]?.commission ? state[index]?.commission   : 0}
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
                        fieldLabel={"Delivery Price"}
                        view={view ? true : false}
                        defaultValue={state[index]?.fixed_delivery_price}
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
                        view={view ? true : false}
                        defaultValue={state[index]?.offer_price}
                    />
                </Grid>

                <Grid item lg={1.5} xs={12}>
                    < DatePickers
                        defaultvalue={state?.[index]?.offer_date_from}
                        values={getValues('offer_date_from')}
                        changeValue={(e: any) => onChange(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'offer_date_from')}
                        fieldName='offer_date_from'
                        error={errors.offer_date_from}
                        fieldLabel={'Offer From'}
                    // defaultvalue={state[index]?.}

                    />
                </Grid>
                <Grid item lg={1.5} xs={12}>
                    <DatePickers
                        defaultvalue={state?.[index]?.offer_date_to}
                        values={getValues('offer_date_to')}
                        changeValue={(e: any) => onChange(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'offer_date_to')}
                        fieldName='offer_date_to'
                        error={errors.offer_date_to}
                        fieldLabel={'Offer To'}
                    />
                </Grid>
                {stock && <Grid item lg={1.5} xs={12}>
                    <CustomInputNormal
                        onChangeValue={(e: any) => onChange(e.target.value, 'stock_value')}
                        disabled={false}
                        type='number'
                        error={errors.stock_value}
                        fieldName="stock_value"
                        placeholder={``}
                        fieldLabel={"Stock"}
                        view={view ? true : false}
                        defaultValue={state[index]?.stock_value}
                    />
                </Grid>}
            </Grid>
        </Box>
    )
})

export default CustomProductVarient
