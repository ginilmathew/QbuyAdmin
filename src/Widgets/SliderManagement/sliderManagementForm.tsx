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
import CustomLoader from '@/components/CustomLoader';
import CustomSingleSearch from '@/components/CustomSingleSearch';
import { getProduct } from '@/helpers/productHelper/productHelper';

type Props = {
    res?: any
}

type Inputs = {
    order_number: any,
    image: any,
    franchise_id: string,
    store: any,
    vendor_id: any,
    product_id: any,
    screentype: any,


}

type IFormInput = {
    order_number: any,
    image: any,
    franchise_id: string,
    store: any,
    vendor_id: any,
    product_id: any,
    screentype: any,

}

const SliderManagementForm = ({ res }: Props) => {



    const router = useRouter()


    const [imagefile, setImagefile] = useState<null | File>(null)
    const [productList, setProductList] = useState<any>([]);
    const [productListRes, setProductListRes] = useState<any>([]);
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [getfranchise, setGetFranchise] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchise, setFranchise] = useState<string>('')
    const [sliderList, setSliderList] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false)
    const [vendor, setVendor] = useState<any>([]);
    const [productData, setProductData] = useState<any>([]);
    const [vendorDetails, setVendorDetails] = useState<any>(null)
    const [vendorSelect, setVendorSelect] = useState<string>(" ");
    const [selectProduct, setSelectProduct] = useState<any>([]);
    const [selectType, setSelectType] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [singleProduct, setSingleProduct] = useState<any>(null)



    const orderValidation = /^(0|[1-9]\d*)$/

    const store = {
        franchise_id: yup.string().required('Franchisee is Required'),
        order_number: yup.string().required('Order Number is Required').matches(orderValidation, 'Order should be number'),
        image: yup
            .mixed()
            .required('Image is Required'),
        vendor_id: yup.string().required('Store is Required'),
    }
    const products = {
        franchise_id: yup.string().required('Franchisee is Required'),
        order_number: yup.string().required('Order Number is Required').matches(orderValidation, 'Order should be number'),
        image: yup
            .mixed()
            .required('Image is Required'),
        vendor_id: yup.string().required('Store  is Required'),
        product_id: yup.string().required('Product is Required'),

    }
    const all = {
        franchise_id: yup.string().required('Franchisee is Required'),
        order_number: yup.string().required('Order Number is Required').matches(orderValidation, 'Order should be number'),
        image: yup
            .mixed()
            .required('Image is Required'),
    }






    const schema = yup
        .object()
        .shape(selectType === "store" ? store : selectType === "product" ? products : all)



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
                order_number: '',

            }
        });




    const onChangeSelectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFranchise(e.target.value)

        setSelectedProduct(null)
        setProductListRes([])
        setProductList([])
        setSelectType(null)
        setValue("screentype", "")
        setVendorSelect('')

        setValue('franchise_id', e.target.value)
        setError('franchise_id', { message: '' })
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)

            setVendor(response?.data?.data)

        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)

        }
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

    const getVendortList = (async () => {
        if (sliderList?.vendor_id && sliderList?.franchise_id) {
            try {
                const response = await fetchData(`admin/vendor-list/${sliderList?.franchise_id}/${process.env.NEXT_PUBLIC_TYPE}`)
                setVendor(response?.data?.data)
                setValue('vendor_id', sliderList?.vendor_id)
            } catch (err: any) {

            }

            try {
                const responseProduct = await postData('admin/product/vendorproducts', { id: sliderList?.vendor_id, type: process.env.NEXT_PUBLIC_TYPE });
                const Filter = responseProduct?.data?.data?.map((res: any) => ({
                    label: res?.name,
                    id: res?._id
                }))
                const selectedProduct = Filter.find((res: any) => res?.id === sliderList.product_id)

                setSelectedProduct(selectedProduct)
                setProductListRes(responseProduct?.data?.data)
                setProductList(Filter)

            } catch (err: any) {

            }

        }

    })






    interface ScreenTypeItem {
        name: string;
        id: number;
        value: string;
    }

    const ScreenType: any = [
        {
            name: "Store",
            id: 1,
            value: "store"

        },
        {
            name: "Product",
            id: 2,
            value: "product"

        },
        {
            name: "Reset",
            id: 2,
            value: "reset"

        }

    ]


    const onSelectStore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setVendorSelect(e.target.value)
        setValue("vendor_id", e.target.value)
        let result = vendor?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                commision: get?.additional_details ? get?.additional_details.commission : 0,
                id: get?._id,
                name: get?.store_name,
                category: get?.category_id
            }

        ))
        let vendorDetails = vendor?.filter((res: any) => res?._id === e.target.value);
        setVendorDetails(vendorDetails)

        try {
            const response = await postData('admin/product/vendorproducts', { id: result?.[0]?.id, type: process.env.NEXT_PUBLIC_TYPE });
            const Filter = response?.data?.data?.map((res: any) => ({
                label: res?.name,
                id: res?._id
            }))
            setProductListRes(response?.data?.data)
            setProductList(Filter)
        } catch (err: any) {
            toast.error(err)
        }
        setValue('vendor_id', e.target.value)
        setError('vendor_id', { message: '' })
    }





    const OnChangeProduct = async (value: any) => {

        let data = productListRes?.filter((res: any) => res?._id === value?.id);
        let prdctlist: any = await getProduct(data?.[0] || []);

        let autosearch = {
            id: prdctlist?._id,
            label: prdctlist?.name
        }
        if (prdctlist?._id !== undefined) {
            setSingleProduct(autosearch)
            setValue("product_id", prdctlist?._id);
            setError('product_id', { message: "" })
            setSelectProduct(prdctlist)
            setProductData(prdctlist)
        } else {
            setSingleProduct([])
        }
        setSelectedProduct([])

    }


    const onChangeType = useCallback((e: any) => {
        const { value } = e.target;
        if (value !== "reset") {
            if (value === "store") {
                setSingleProduct([])
                setValue("product_id", "")
                setSelectProduct(null)
                setProductData(null)
            }
            setSelectType(value)
            setValue("screentype", value)
        } else {
            setSelectType(null)
            setValue("screentype", "")
        }

    }, [])



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
        formData.append("product_id", data?.product_id);
        formData.append("vendor_id", data?.vendor_id);
        formData.append("screentype", data?.screentype ? data?.screentype : null)
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

    useEffect(() => {

        if (sliderList) {
            getVendortList()
            setVendorSelect(sliderList?.vendor_id)
            setValue("vendor_id", sliderList?.vendor_id)
            setValue('franchise_id', sliderList?.franchise_id)
            setFranchise(sliderList?.franchise_id)
            setValue('order_number', sliderList?.order_number)
            setValue('image', sliderList?.image)
            setImagePreview(`${IMAGE_URL}${sliderList?.image}`)
            setSelectType(sliderList?.screentype)
            setValue('product_id', sliderList?.product_id)
            setValue('screentype', sliderList?.screentype)

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





    if (loader) {
        return <>
            <CustomLoader />
        </>
    }

    return (
        <Box>
            <CustomBox title='Slider Details'>
                <Grid container spacing={2}>

                    <Grid item xs={12} lg={2}>
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
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.screentype}
                            fieldName="screentype"
                            placeholder={``}
                            fieldLabel={"Screen Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={selectType}
                            options={''}
                            onChangeValue={onChangeType}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Store</>
                            </MenuItem>
                            {ScreenType && ScreenType.map((res: any) => (
                                <MenuItem value={res?.value}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>

                    {(selectType === "store" || selectType === "product") &&
                        <Grid item xs={12} lg={2}>
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.vendor_id}
                                fieldName="vendor_id"
                                placeholder={``}
                                fieldLabel={"Store Name"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={vendorSelect}
                                options={''}
                                onChangeValue={onSelectStore}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Store</>
                                </MenuItem>
                                {vendor && vendor?.map((res: any) => (
                                    <MenuItem value={res?._id}>{res?.store_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>}
                    {selectType === "product" &&
                        <Grid item xs={12} lg={2}>
                            <CustomSingleSearch
                                control={control}
                                error={errors.product_id}
                                fieldName="product_id"
                                list={productList}
                                value={singleProduct ? singleProduct : selectedProduct}
                                onChangeValue={OnChangeProduct}
                                fieldLabel='Products' />
                        </Grid>
                    }

                    <Grid item xs={12} lg={2}>
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
                    <Grid item xs={12} lg={2}>
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