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
import CustomLoader from '@/components/CustomLoader';


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
    category_id: any

}
type props = {
    res?: any,
    view?: any

}

const SubCategoryForm = ({ res, view }: props) => {

    const idd = res ? res : view;


    const router = useRouter()



    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [_id, set_id] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false)
    const [categoryList, setCategoryList] = useState<any>([])
    const [categoryID, setCategoryID] = useState<any>('')
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [subCategoryList, setSubCategoryList] = useState<any>([])
    const schema = yup
        .object()
        .shape({
            category_id: yup.string().required('Category is Required'),
            name: yup.string().max(30, "Name must be less than 30 characters").matches(
                /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
                'Name can only contain Latin letters.'
            )
                .required('Name is Required'),

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
                category_id: '',
            }
        });







    const getCategoryList = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/category/list/${type}`)
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

    const getSubCategory = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/subcategory/show/${idd}`)
            setSubCategoryList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }


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





    useEffect(() => {
        if (idd) {
            getSubCategory()
        }
    }, [idd])

    useEffect(() => {
        if (subCategoryList && idd) {

            setValue('order_number', subCategoryList?.order_number)
            setValue('name', subCategoryList?.name)
            setImagePreview(`${IMAGE_URL}${subCategoryList?.image}`)
            setValue('image', subCategoryList?.image)
            if (subCategoryList?.category_id) {
                setValue('category_id', subCategoryList?.category_id)
                setCategoryID(subCategoryList?.category_id)
            }
        }
    }, [subCategoryList, idd])

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        const URL_CREATE = '/admin/subcategory/create'
        const URL_EDIT = '/admin/subcategory/update'


        setLoading(true)
        const formData = new FormData();
        if (subCategoryList) {
            formData.append("id", subCategoryList?._id);
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
            await postData(subCategoryList ? URL_EDIT : URL_CREATE, formData)
            setImagePreview(null)
            setCategoryID('')
            reset()
            router.push('/subCategory')
            toast.success(subCategoryList ? 'Updated Successfully' : 'Created Successfully')

        } catch (err: any) {
            toast.error(err?.message)

        } finally {
            setLoading(false)
        }

    }

    if (loader) {
        return <><CustomLoader /></>
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
                            <Avatar variant='square' src={`${IMAGE_URL}${subCategoryList?.image}`} sx={{ width: '100%', height: 130 }} />
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
