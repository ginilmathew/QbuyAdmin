import { Box, Grid, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
const CategoryForm = () => {


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
            <CustomBox title='Basic Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Category Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Display Order"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Types"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={type}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Qbuy Panda</MenuItem>
                            <MenuItem value={20}>Qbuy Fashion</MenuItem>
                            <MenuItem value={30}>Qbuy Green</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.closetime}
                            fieldName="category"
                            placeholder={``}
                            fieldLabel={"Image"}
                            control={control}
                            height={150}
                            max={5}
                            onChangeValue={imageUploder}
                            preview={imagefile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"90%"}
                        />
                    </Grid>
                </Grid>
            </CustomBox>

            <Box py={3}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false} startIcon={false} height={''} label={'Add Category'} onClick={() => null} />
            </Box>

            <CustomBox title='Sub Category'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Category Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="enter your email"
                            placeholder={``}
                            fieldLabel={"Display Order"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.closetime}
                            fieldName="Subcategory"
                            placeholder={``}
                            fieldLabel={"Image"}
                            control={control}
                            height={100}
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
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add SubCategory'} onClick={() => null} />
            </Box>
        </Box>
    )
}

export default CategoryForm