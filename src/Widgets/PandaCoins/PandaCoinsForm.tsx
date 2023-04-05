import CustomInput from '@/components/CustomInput'
import { Box, Grid, MenuItem } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTextarea from '@/components/CustomTextarea';
const PandaCoinsForm = () => {
    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();
    return (
        <Box>
            <CustomBox title='Panda Coin Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.4}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={"category"}
                            options={''}
                            onChangeValue={"onChangeSelect"}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Coupon Type"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Code"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Locality"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Value"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Minimum Cart Value"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>

            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Panda Coins'} onClick={() => null} />
            </Box>

        </Box>
    )
}

export default PandaCoinsForm
