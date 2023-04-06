import { Box, Grid, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTextarea from '@/components/CustomTextarea';

const MesssageBannerForm = () => {
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>("");


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();


    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value)


    }

    const imageUploder = (file: any) => {
        setImagefile(file)
        console.log({ file })
    }


    return (
        <Box>
            <CustomBox title='Message Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Store Name"}
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
                            fieldLabel={"Franchise"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>

                    <Grid item lg={3} xs={12}>
                        <CustomDatePicker
                            changeValue={() => null}
                            fieldName='pickupTime'
                            control={control}
                            error={errors.pickupTime}
                            fieldLabel={'Expiry Time'}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.closetime}
                            fieldName="Subcategory"
                            placeholder={``}
                            fieldLabel={"Banner Image"}
                            control={control}
                            height={120}
                            max={5}
                            onChangeValue={imageUploder}
                            preview={imagefile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"80%"}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
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
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Message'} onClick={() => null} />
            </Box>

        </Box>
    )
}

export default MesssageBannerForm
