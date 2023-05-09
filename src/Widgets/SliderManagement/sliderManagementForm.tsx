import { Box, Divider, Grid, Typography, MenuItem, Avatar } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import CustomInput from '@/components/CustomInput';
import { fetchData, postData } from '@/CustomAxios';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import { useRouter } from 'next/router';
import { type } from 'os';
import { IMAGE_URL } from '@/Config';

type Props = {
    res?: any
}

type Inputs = {
    order_number: any,
    image: any,
    franchise_id: string,

}

type IFormInput = {
    order_number: any,
    image: any,
    franchise_id: string,

}

const SliderManagementForm = ({ res }: Props) => {

    console.log({ res })

    const router = useRouter()

    const [imagefile, setImagefile] = useState<null | File>(null)
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [getfranchise, setGetFranchise] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchise, setFranchise] = useState<string>('')
    const [sliderList, setSliderList] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false)

    const orderValidation = /^(0|[1-9]\d*)$/
    const schema = yup
        .object()
        .shape({
            franchise_id: yup.string().required('Franchisee is Required'),
            order_number: yup.string().required('Order Number is Required').matches(orderValidation, 'Order should be number'),
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
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                franchise_id: '',
                order_number: ''
            }
        });


    const onChangeSelectFranchise = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFranchise(e.target.value)
        setValue('franchise_id', e.target.value)
        setError('franchise_id', { message: '' })
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


    const getSlider = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/slider/show/${res}`)
            setSliderList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }


    const getFranchiseList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/franchise/list')
            setGetFranchise(response?.data?.data)
            setLoading(false)

        } catch (err: any) {
            toast.error(err)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (sliderList) {
            setValue('franchise_id', sliderList?.franchise_id)
            setFranchise(sliderList?.franchise_id)
            setValue('order_number', sliderList?.order_number)
            setValue('image', sliderList?.image)
            setImagePreview(`${IMAGE_URL}${sliderList?.image}`)
        }

    }, [sliderList])


    useEffect(() => {
        getFranchiseList()
    }, [])

    useEffect(() => {
        if (res) {
            getSlider()
        }
    }, [res])


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {

        const CREATE_URL = 'admin/slider/create';
        const UPDATE_URL = 'admin/slider/update';

        const formData = new FormData();
        formData.append("franchise_id", data?.franchise_id);
        if (imagefile) {
            formData.append("image", data?.image);
        }
        if (sliderList) {
            formData.append("id", sliderList?._id);
        }
        
        formData.append("type", type);
        formData.append("order_number", data?.order_number);
        try {
            setLoading(true)
            await postData(res ? UPDATE_URL : CREATE_URL, formData)
            reset()
            toast.success(res ? 'Update Successfully' : 'Created Successfully')
            router.push('/sliderManagement')
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <CustomBox title='Slider Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.5}>
                        <Customselect
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.franchise_id}
                            fieldName="franchise_id"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={franchise}
                            options={''}
                            onChangeValue={onChangeSelectFranchise}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Franchise</>
                            </MenuItem>
                            {getfranchise && getfranchise?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
                                <MenuItem key={res?._id} value={res?._id}>{res?.franchise_name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.order_number}
                            fieldName="order_number"
                            placeholder={``}
                            fieldLabel={"Order number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        /></Grid>
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
                    label={res ? 'Update Slider' : 'Add Slider'}
                    onClick={handleSubmit(onSubmit)} />
            </Box>
        </Box>
    )
}

export default SliderManagementForm