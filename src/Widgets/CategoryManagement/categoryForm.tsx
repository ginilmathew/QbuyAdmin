import { Box, Grid, MenuItem } from '@mui/material'
import React, { useState, useEffect } from 'react'
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
import { Message } from '@mui/icons-material';
import { IMAGE_URL } from '@/Config';

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


type props = {
    resData?: any
}


const CategoryForm = ({ resData }: props) => {

    console.log({ resData })

    const [imagefile, setImagefile] = useState<null | File>(null)
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [loading, setLoading] = useState<boolean>(false)


    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Category Name Required'),
            // type: yup.string().required('Type is Required'),
            seo_description:yup.string().required('Description is Required'),
            order_number: yup.number().typeError('Order must be integer').required('Order Number is Required'),
            image: yup
                .mixed()
                .required('Image is Required')
        })
        .required();


    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
        });


    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value)
        setValue('type', e.target.value)
        setError('type', { message: '' })

    }

    const imageUploder = (file: any) => {
        setImagefile(file)
        setImagePreview(null)
        setValue('image', file)
        setError('image', { message: '' })
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        //console.log({data, type: process.env.NEXT_PUBLIC_TYPE})

        const URL_CREATE = '/admin/category/create'
        const URL_EDIT = '/admin/category/update'


        setLoading(true)
        const formData = new FormData();
        if (resData) {
            formData.append("id", resData?._id);
        }
        formData.append("name", data?.name);
        formData.append("order_number", data?.order_number);
        if (imagefile) {
            formData.append("image", data?.image);
        }
        formData.append("type", type);
        // formData.append("seo_title", data?.name);
        formData.append("seo_description", data?.seo_description);
        try {
           await postData(resData ? URL_EDIT : URL_CREATE, formData)
            toast.success(resData ? 'Updated Successfully' : 'Created Successfully')

        } catch (err: any) {
            toast.error(err?.message)

        } finally {
            setLoading(false)
        }


    }



    useEffect(() => {
        if (resData) {
            setValue('name', resData?.name)
            setValue('order_number', resData?.order_number)
            setValue('seo_description', resData?.seo_description)
            setValue('seo_title', resData?.seo_title)
            setValue('image', resData?.image)
            setImagePreview(`${IMAGE_URL}${resData?.image}`)
        }
    }, [resData])


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
                            type='number'
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
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.seo_description}
                            fieldName="seo_description"
                            placeholder={``}
                            fieldLabel={"Discription"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={2.5}>
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
                            <MenuItem value={'panda'}>Qbuy Panda</MenuItem>
                            <MenuItem value={'fashion'}>Qbuy Fashion</MenuItem>
                            <MenuItem value={'green'}>Qbuy Green</MenuItem>
                        </Customselect>
                    </Grid> */}
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
                            viewImage={imagePreview}
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
                    disabled={loading}
                    btncolor=''
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false} startIcon={false}
                    height={''}
                    label={resData ? 'update' : ' Add Category'}
                    onClick={handleSubmit(onSubmit)} />
            </Box>

          


        </Box>
    )
}

export default CategoryForm