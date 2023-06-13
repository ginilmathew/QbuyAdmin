import { Avatar, Box, Grid, MenuItem } from '@mui/material'
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
import { useRouter } from 'next/router';
import CustomLoader from '@/components/CustomLoader';

type Inputs = {
    name: any,
    type: any,
    order_number: any,
    image: any,
    seo_title: any,
    seo_description: any
}

type IFormInput = {
    name: any,
    type: any,
    order_number: any,
    image: any,
    seo_title: any,
    seo_description: any

}


type props = {
    resData?: any,
    view?: any
}


const CategoryForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;

    const router = useRouter()


    const [imagefile, setImagefile] = useState<null | File>(null)
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [CategoryList, setCategoryList] = useState<any>(null)


    const orderValidation = /^(0|[1-9]\d*)$/
    const schema = yup.object().shape({
            name: yup.string().max(30, "Name must be less than 30 characters").matches(
                /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
                'Name can only contain Alphabets letters.'
            ).required('Category Name is Required'),
            // type: yup.string().required('Type is Required'),
            // seo_description: yup.string().max(100, 'Maximum Character Exceeds'),
            order_number: yup.string().matches(orderValidation, 'Order should be number'),
            image: yup
                .mixed()
                .required('Image is Required')
        })



    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue,} = useForm<any>({
            resolver: yupResolver(schema),
            defaultValues: {
                name: '',
                seo_description: '',
                order_number: '',
            }
        });




    const getCategory = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/category/show/${idd}`)
            setCategoryList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }


    useEffect(() => {
        if (idd) {
            getCategory()
        }
    }, [idd])



    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value)
        setValue('type', e.target.value)
        setError('type', { message: '' })

    }

    const imageUploder = (file: any) => {

        if (file.size <= 1000000) {
            setImagefile(file)
            setImagePreview(null)
            setValue('image', file)
            setError('image', { message: '' })

        } else {
            setImagePreview(null)
            setImagefile(null)
            toast.warning('Image should be less than or equal 1MB')
        }



    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        //console.log({data, type: process.env.NEXT_PUBLIC_TYPE})

        const URL_CREATE = '/admin/category/create'
        const URL_EDIT = '/admin/category/update'


        setLoading(true)
        const formData = new FormData();
        if (CategoryList) {
            formData.append("id", CategoryList?._id);
        }
        formData.append("name", data?.name);
        formData.append("order_number", data?.order_number ? data?.order_number : null);
        if (imagefile) {
            formData.append("image", data?.image);
        }
        formData.append("type", type);
        // formData.append("seo_title", data?.name);
        formData.append("seo_description", data?.seo_description);
        try {
            await postData(idd ? URL_EDIT : URL_CREATE, formData)
            reset();
            setImagefile(null)
            setImagePreview(null)
            toast.success(idd ? 'Updated Successfully' : 'Created Successfully')
            router.push('/category')
        } catch (err: any) {
            toast.error(err?.message)

        } finally {
            setLoading(false)
        }


    }


    useEffect(() => {
        if (CategoryList) {

            setValue('name', CategoryList?.name)
            setValue('order_number', CategoryList?.order_number)
            setValue('seo_description', CategoryList?.seo_description)
            setValue('seo_title', CategoryList?.seo_title)
            setValue('image', CategoryList?.image)
            setImagePreview(`${IMAGE_URL}${CategoryList?.image}`)
        }
    }, [CategoryList])


    if (loader) {
        return <><CustomLoader /></>
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
                            view={view ? true : false}
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
                            view={view ? true : false}
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
                            fieldLabel={"Description"}
                            disabled={false}
                            view={view ? true : false}
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
                    {!view &&
                        <Grid item xs={12} lg={2.5}>
                            <CustomImageUploader
                                ICON={""}
                                format={'image/*'}
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
                        </Grid>}
                    {view &&
                        <Grid item xs={12} lg={2.5}>
                            <Avatar variant='square' src={`${IMAGE_URL}${CategoryList?.image}`} sx={{ width: '100%', height: 130 }} />
                        </Grid>}

                </Grid>
            </CustomBox>
            {!view &&
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
                </Box>}
        </Box>
    )
}

export default CategoryForm