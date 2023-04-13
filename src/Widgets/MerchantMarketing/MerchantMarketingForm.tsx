import { FormInputs } from '@/utilities/types';
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Divider, Grid, MenuItem } from '@mui/material'
import CustomInput from '@/components/CustomInput';
import CustomBox from '../CustomBox';
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTextarea from '@/components/CustomTextarea';

const MerchantMarketingForm = () => {

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();
    return (
        <Box>
            <CustomBox title='Franchise Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Franchise"}
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
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.email}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Merchant Name"}
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
                                fieldLabel={"Promotion Amount"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item lg={3} xs={12}>
                            <CustomDatePicker
                                values={''}
                                changeValue={() => null}
                                fieldName='pickupTime'
                                control={control}
                                error={errors.pickupTime}
                                fieldLabel={'Expiry Time'}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <CustomTextarea
                                control={control}
                                error={errors.email}
                                fieldName="enter your email"
                                placeholder={``}
                                fieldLabel={"Promotion Description"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                    </Grid>
               
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Details'} onClick={() => null} />
            </Box>
            


        </Box>
    )
}

export default MerchantMarketingForm
