import React, { useState } from 'react'
import CustomBox from '../CustomBox'
import { Box, Grid, MenuItem } from '@mui/material'
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { fetchData, postData } from '@/CustomAxios';
import { useForm, SubmitHandler } from "react-hook-form";


type Inputs = {
    name: string,
    type: string,
    order_number: string,
    image: any,
    seo_title: string,
    seo_description: string,
    category_id: string
}

type IFormInput = {
    name: string,
    type: string,
    order_number: string,
    image: any,
    seo_title: string,
    seo_description: string,
    category_id: string

}
type props = {
    res: any,
    setRes: any
}

const SubCategoryForm = ({ res, setRes }: props) => {

    console.log({ res })

    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>("");
    const [_id, set_id] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)



    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Required'),
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
            defaultValues: {
                name: '',
                order_number: '',
            }
        });

    const imageUploder = (file: any) => {
        setImagefile(file)
        setValue('image', file)
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true)
        const formData = new FormData();
        formData.append("name", data?.name);
        formData.append("order_number", data?.order_number);
        if (data?.image) {
            formData.append("image", data?.image);
        }
        formData.append("type", res?.type);
        formData.append("seo_title", data?.name);
        formData.append("seo_description", data?.name + res?.type);
        formData.append("category_id", res?._id);
        try {
            const response = await postData('/admin/subcategory/create', formData)
            reset()
            setRes(null)
            toast.success('Created Successfully')

        } catch (err: any) {
            toast.error(err?.message)

        } finally {
            setLoading(false)
        }


    }

    return (
        <>
            <CustomBox title='Sub Category'>
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
                    <Grid item xs={12} lg={2}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.image}
                            fieldName="Subcategory"
                            placeholder={``}
                            fieldLabel={"Image"}
                            control={control}
                            height={120}
                            max={5}
                            onChangeValue={imageUploder}
                            preview={imagefile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"100%"}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Add SubCategory'}
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                />
            </Box>
        </>
    )
}

export default SubCategoryForm
