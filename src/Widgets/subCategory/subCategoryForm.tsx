import React, { useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import { Avatar, Box, Grid, MenuItem } from '@mui/material'
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { fetchData, postData } from '@/CustomAxios';
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/router';
import { IMAGE_URL } from '@/Config';


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
    res?: any,
    view?: any

}

const SubCategoryForm = ({ res, view }: props) => {

    const resData = res ? res : view;


    const router = useRouter()



    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [_id, set_id] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    const [categoryList, setCategoryList] = useState<any>([])
    const [categoryID, setCategoryID] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<any>(null)

    const schema = yup
        .object()
        .shape({
            category_id: yup.string().required('Category is Required'),
            name: yup.string().required('Name is Required'),

            image: yup
                .mixed()
                .required('Image is Required')
        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                name: '',
                order_number: '',
                category_id: ''
            }
        });

    const imageUploder = (file: any) => {
        if (file.size <= 1000000) {
            setImagePreview(null)
            setImagefile(file)
            setValue('image', file)
            setError('image', { message: '' })
        } else {
            setImagefile(null)
            setImagePreview(null)
            toast.warning('Image should be less than or equal 1MB')
        }

    }


    const onChangeSelectCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryID(e.target.value)
        setValue('category_id', e.target.value)
        setError('category_id', { message: '' })
    }

    const getCategoryList = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/category/list/${process.env.NEXT_PUBLIC_TYPE}`)
            setCategoryList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)

        }
        finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        getCategoryList()
    }, [])



    useEffect(() => {
        if (resData) {
            setValue('category_id', resData?.category_id)
            setCategoryID(resData?.category_id)
            setValue('order_number', resData?.order_number)
            setValue('name', resData?.name)
            setImagePreview(`${IMAGE_URL}${resData?.image}`)
            setValue('image', resData?.image)
        }
    }, [resData])

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        const URL_CREATE = '/admin/subcategory/create'
        const URL_EDIT = '/admin/subcategory/update'


        setLoading(true)
        const formData = new FormData();
        if (res) {
            formData.append("id", res?._id);
        }
        formData.append("name", data?.name);
        formData.append("order_number", data?.order_number);
        if (imagefile) {
            formData.append("image", data?.image);
        }
        formData.append("type", type);
        formData.append("seo_title", data?.name);
        formData.append("seo_description", data?.name + type);
        formData.append("category_id", data?.category_id);
        try {
            await postData(res ? URL_EDIT : URL_CREATE, formData)
            setImagePreview(null)
            setCategoryID('')
            reset()
            router.push('/subCategory')
            toast.success(res ? 'Updated Successfully' : 'Created Successfully')

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
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.category_id}
                            fieldName="category_id"
                            placeholder={``}
                            fieldLabel={"Category"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={categoryID}
                            options={''}
                            onChangeValue={onChangeSelectCategory}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Category</>
                            </MenuItem>
                            {categoryList && categoryList?.map((res: any) => (
                                <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"SubCategory Name"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={2.5}>
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
                    </Grid> */}

                    {!view &&
                        <Grid item xs={12} lg={2.5}>
                            <CustomImageUploader
                                ICON={""}
                                viewImage={imagePreview}
                                error={errors.image}
                                fieldName="Subcategory"
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
                                width={"100%"}
                            />

                        </Grid>}

                    {view &&
                        <Grid item xs={12} lg={2.5}>
                            <Avatar variant='square' src={`${IMAGE_URL}${view?.image}`} sx={{ width: '100%', height: 130 }} />
                        </Grid>}
                </Grid>
            </CustomBox>

            {!view &&
                <Box py={3}>
                    <Custombutton
                        btncolor=''
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={res ? 'Update' : 'Add SubCategory'}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    />
                </Box>}
        </>
    )
}

export default SubCategoryForm
