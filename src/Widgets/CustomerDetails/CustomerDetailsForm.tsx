import { Box, Grid, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomBox from '../CustomBox';
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';

type Inputs = {
    name: String;
    mobile: string;
    email: string;
    group: any
}

const CustomerDetailsForm = () => {



    const schema = yup
        .object()
        .shape({


        })



    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {

            }
        });

    const CheckBlackList = () => {

    }


    return (
        <Box>
            <CustomBox title='Basic Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Email Address"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.group}
                            fieldName="group"
                            placeholder={``}
                            fieldLabel={"Customer Group"}
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
                    <Grid item xs={12} lg={2}>

                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={true} label='' onChange={CheckBlackList} title='Blacklist Customer' />

                    </Grid>

                </Grid>
            </CustomBox>
        </Box>
    )
}

export default CustomerDetailsForm