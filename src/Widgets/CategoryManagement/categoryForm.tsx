import { Box, Grid, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { fetchData, postData } from '@/CustomAxios';
import SubCategoryForm from './subCategoryForm';

type Inputs = {
    name: string,
    type: string,
    order_number: string,
    image: any,
    seo_title: string,
    seo_description: string
}

type IFormInput = {
    name: string,
    type: string,
    order_number: string,
    image: any,
    seo_title: string,
    seo_description: string

}



const CategoryForm = () => {


    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>("");
    const [res, setRes] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false)


    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Required'),
            type: yup.string().required('Required'),
            order_number: yup.string().required('Required')
        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
        });


    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value)
        setValue('type', e.target.value)
    }

    const imageUploder = (file: any) => {
        setImagefile(file)
        setValue('image', file)
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true)
        const formData = new FormData();
        formData.append("name", data?.name);
        formData.append("order_number", data?.order_number);
        formData.append("image", data?.image);
        formData.append("type", data?.type);
        formData.append("seo_title", data?.name);
        formData.append("seo_description", data?.name + data?.type);
        try {

            const response = await postData('/admin/category/create', formData)
            setRes(response?.data?.data)
            toast.success('Created Successfully')

        } catch (err: any) {
            toast.error(err?.message)

        } finally {
            setLoading(false)
        }


    }



    return (
        <Box>
            <CustomBox title='Basic Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
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
                            error={errors.order_number}
                            fieldName="order_number"
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
                            error={errors.type}
                            fieldName="type"
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
                            <MenuItem value="" disabled >
                                <>Select Types</>
                            </MenuItem>
                            <MenuItem value={'Qbuy Panda'}>Qbuy Panda</MenuItem>
                            <MenuItem value={'Qbuy Fashion'}>Qbuy Fashion</MenuItem>
                            <MenuItem value={'Qbuy Green'}>Qbuy Green</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.image}
                            fieldName="image"
                            placeholder={``}
                            fieldLabel={"Image"}
                            control={control}
                            height={130}
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
                    disabled={loading}
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false} startIcon={false} height={''} label={'Add Category'} onClick={handleSubmit(onSubmit)} />
            </Box>

            {res && <SubCategoryForm res={res} setRes={setRes} />}


        </Box>
    )
}

export default CategoryForm