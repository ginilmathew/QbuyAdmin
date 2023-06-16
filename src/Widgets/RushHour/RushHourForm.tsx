import { Box, Grid, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';

import Custombutton from '@/components/Custombutton';

import CustomTextarea from '@/components/CustomTextarea';
import CustomTimepicker from '@/components/CustomTimepicker';

const RushHourForm = () => {

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();

    return (
        <Box>
            <CustomBox title='Add Rush Hour'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomTimepicker
                            changeValue={() => null}
                            fieldName='pickupTime'
                            control={control}
                            error={errors.pickupTime}
                            fieldLabel={'Expiry Time(Hrs)'} />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <CustomTextarea
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Message"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} letterSpacing={.5}>

                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Message'} onClick={() => null} />
            </Box>

        </Box>
    )
}

export default RushHourForm
