import CustomBox from '@/Widgets/CustomBox';
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import { FormInputs } from '@/utilities/types';
import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";

function OrderAssignCriteria() {
    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();

    return (
        <Box px={5} py={2} pt={10} mt={0} >
            <CustomBox title='Order Assign Criteria'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"(if)Rider Store Distance-Kms"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Rider Utilization"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"(if) Rider Rating Above"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Update Criteria'} onClick={() => null} />
            </Box>

        </Box>
    )
}

export default OrderAssignCriteria