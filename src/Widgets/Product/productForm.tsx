import { Avatar, Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { useForm, SubmitHandler } from "react-hook-form";
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomImageUploader from '@/components/CustomImageUploader';
import CustomTimepicker from '@/components/CustomTimepicker';
import { CustomMultipleImageUploader } from '@/components/CustomMultipleImageUploder';
import Custombutton from '@/components/Custombutton';
import AddIcon from '@mui/icons-material/Add';
import CustomProductVarient from './CustomProductVarient';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import moment from 'moment'
import CustomDatePicker from '@/components/CustomDatePicker';
import Maps from '../../components/maps/maps'
import { isEmpty, isNull, isNumber, truncate } from 'lodash';
import Polygon from '@/components/maps/Polygon';
import { IMAGE_URL } from '../../Config/index';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Attributes from './Attributes'
import { useRouter } from 'next/router';
import CustomTagInputValue from '@/components/CustomTagInputValue';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import ClearIcon from '@mui/icons-material/Clear';
import CustomLoader from '@/components/CustomLoader';
import CustomMultiselect from '@/components/CustomMultiselect';
type Inputs = {
    name: string,
    description: string,
    store: any,
    franchisee: any,
    weight: string,
    dimensions: any,
    width: string,
    height: string,
    model: string,
    type: string,
    product_type: string,
    category: any,
    sub_category: any,
    display_order: any,
    panda_suggession: boolean,
    stock: boolean,
    stock_value: any,
    minimum_qty: any,
    product_availability_from: any,
    product_availability_to: any,
    require_shipping: boolean,
    delivery_locations: any,
    coupon_details: string,
    meta_tags: any,
    image: any,
    product_image: any,
    video_link: string,
    related_products: any,
    attributess: any,
    regular_price: any,
    seller_price: any,
    offer_price: any,
    offer_date: any,
    variant: boolean,
    offer_date_from: any,
    offer_date_to: any,
    stock_values: string,
    application_type: string,
    commission: any,
    fixed_delivery_price: any,
    thumbnail: any,
    approval_status: string,
    food_type: string,
    product_tags: any,
    category_type: string,
    search_tags: any
}

type IFormInput = {
    name: string,
    description: string,
    store: any,
    franchisee: any,
    weight: string,
    dimensions: any,
    width: string,
    height: string,
    model: string,
    type: string,
    product_type: string,
    category: any,
    sub_category: any,
    display_order: any,
    panda_suggession: boolean,
    stock: boolean,
    stock_value: any,
    minimum_qty: any,
    product_availability_from: any,
    product_availability_to: any,
    require_shipping: boolean,
    delivery_locations: any,
    coupon_details: string,
    meta_tags: any,
    image: any,
    product_image: any,
    video_link: string,
    related_products: any,
    attributess: any,
    regular_price: any,
    seller_price: any,
    offer_price: any,
    offer_date: any,
    variant: boolean,
    offer_date_from: any,
    offer_date_to: any,
    stock_values: string,
    application_type: string,
    commission: any,
    fixed_delivery_price: any,
    thumbnail: any,
    approval_status: string,
    food_type: string,
    product_tags: any,
    category_type: string,
    search_tags: any
}

type props = {
    res?: any
    view?: any
}

const ProductForm = ({ res, view }: props) => {
    let idd = res ? res : view;

 

    const router = useRouter()

    const [multipleImage, setMultipleImage] = useState<any>([])
    const [defaultImage, setdefaultImage] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [stock, setStock] = useState<boolean>(false)
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [thumbnailPreview, setthumbnailPreview] = useState<any>(null);
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [thumbnailfile, setThumbnailFile] = useState<null | File>(null)
    const [attributes, setAttributes] = useState<any>([])
    const [metaTag, setMetaTag] = useState<any>([])
    const [searchTag, setSearchTag] = useState<any>([])
    const [attributeTag, setattributeTag] = useState<any>([])
    const [attributeTagValue, setattributeTagValue] = useState<any | null>(null)
    const [index, setIndex] = useState<number>(0)
    const [varients, setVarients] = useState<any>([])
    const [vendorList, setVendorList] = useState<any>([])
    const [vendorSelect, setvendorSelect] = useState<any>(null);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [categorySelect, setCategorySelect] = useState<any>(null);
    const [subcategorySelect, setSubCategorySelect] = useState<any>(null);
    const [categoryList, setCategoryList] = useState<any>([]);
    const [subcategoryList, setSubCategoryList] = useState<any>([]);
    const [pandaSuggesion, setPandaSuggesions] = useState<boolean>(false);
    const [paths, setPaths] = useState<any>(null)
    const [requireShipping, setRequireShipping] = useState<boolean>(false)
    const [varientsarray, setVarientsArray] = useState<any>([])
    const [vendorlistDirection, setVendorListDirection] = useState<any>([])
    const [recomendedProductList, setRecomendedProductList] = useState<any>([]);
    const [recomendedProductArray, setRecomendedProductArray] = useState<any>([]);
    const [recomendedProductEditList, setRecomendedProductEditList] = useState<any>([]);
    const [productList, setProductList] = useState<any>(null);
    const [offerDate_from, setOffer_Date_from] = useState<any>(null);
    const [offerDate_to, setOffer_Date_to] = useState<any>(null);
    const [statusSelect, setStatusSelect] = useState<any>(null)
    const [time, settime] = useState<any>("")
    const [statusChange, setStatusChange] = useState<any>(
        [
            { value: 'Pending', name: 'pending' }
            , { value: 'approved', name: 'Approved' },
            { value: 'rejected', name: 'Rejected' }
        ])
    const [productType, setProduct_Type] = useState<any>([
        {
            value: 'breakfast',
            name: 'Breakfast'
        },
        {
            value: 'lunch',
            name: 'Lunch'
        },
        {
            value: 'dinner',
            name: 'Dinner'
        },

    ]);

    const [product_category, setProductCategory] = useState<any>([
        {
            value: 'non-veg',
            name: 'Non Veg'
        },
        {
            value: 'veg',
            name: 'Veg'
        },

    ]);



    const [productCategorySelect, setProductCategorySelect] = useState<string>('')
    const [productTagList, setProductTagList] = useState<any>([])
    const [multpleArrayProductTag, setMultipleArrayProductTag] = useState<any>([]);
    const [multpleArrayFoodType, setMultipleArrayFoodType] = useState<any>([]);


    const orderValidation = /^[0-9]*$/
    const schema = yup
        .object()
        .shape({
            name: yup
                .string()
                .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ\s\-0-9\/]+$/, 'Please enter valid name')
                .max(40)
                .required(),
            // display_order: yup.number().nullable().typeError("Must be Integer"),
            display_order: yup.string().matches(orderValidation, 'Accept only positive number').nullable(),
            franchisee: yup.string().typeError('Franchise is Required').required('Franchise is Required'),
            store: yup.string().typeError('Store is Required').required('Store is Required'),
            stock: yup.boolean(),
            category: yup.string().typeError('Category is Required').required('Category is Required'),
            // delivery_locations: yup.array().typeError('Delivery location is Required').required('Delivery location is Required'),
            product_image: yup
                .mixed()
                .required("Product Image is Required"),
            stock_value: (stock === true && varientsarray?.length === 0) ? yup.string().matches(orderValidation, 'Accept only positive number').required("Stock value required").typeError("Stock value must be a number") : yup.string().nullable(),
            // regular_price: 

            // meta_tags: yup.array().typeError('Meta Tags is Required').required('Meta Tag is Required')
            minimum_qty: yup.string().matches(orderValidation, 'Accept only positive number').nullable(),
            // weight: yup.string().max(30, "Name must be less than 30 characters").matches(
            //     /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s/0-9]*)$/gi,
            //     'Only contain alphabets letters.'
            // ).nullable()
            // weight: yup.string()
            //     .max(30, "Name must be less than 30 characters")
            //     .matches(/^(\d+(\.\d*)?|\.\d+)$/, 'Only contain valid numerical values.')
            //     .nullable()
            regular_price: yup.string()
        .test('is-greater-than-zero', 'Regular Price must be greater than 0', function (value) {
            // Check if regular_price is provided and greater than 0
            return !value || (parseFloat(value) > 0);
        })
        .nullable().transform((_, val) => val == Number(val) ? val : null),
        commission: yup.string()
        .test('is-greater-than-zero', 'commission must be greater than 0', function (value) {
            // Check if regular_price is provided and greater than 0
            return !value || (parseFloat(value) > 0);
        })
        .nullable().transform((_, val) => val == Number(val) ? val : null) ,
            //     .string()
            //     .required('Selling Price is Required')
            //     .test('is-greater-than-purchase', 'Selling Price should not be less than Purchase Price', function (value) {
            //         const purchasePrice = this.parent.seller_price;
            //         return parseFloat(value) >= parseFloat(purchasePrice);
            //     }),

            // seller_price: yup
            //     .string()
            //     .required('Purchase Price is Required'),

            // offer_price: yup
            //     .string()
            //     .required('Offer Price is Required')
            //     .test('is-greater-than-purchase', 'Offer Price should not be less than Purchase Price', function (value) {
            //         const purchasePrice = this.parent.seller_price;
            //         return parseFloat(value) >= parseFloat(purchasePrice);
            //     }),


            // .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.')


        })
        .required();



    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                name: '',
                description: '',
                weight: '',
                model: '',
                width: '',
                height: '',
                display_order: '',
                panda_suggession: false,
                stock: false,
                stock_value: '',
                franchisee: productList ? productList?.franchisee : '',
                category: '',
                sub_category: null,
                store: '',
                product_image: null,
                require_shipping: false,
                video_link: '',
                related_products: null,
                image: null,
                regular_price: null,
                offer_price: null,
                offer_date_from: null,
                offer_date_to: null,
                seller_price: null,
                minimum_qty: '',
                delivery_locations: null,
                product_availability_from: null,
                product_availability_to: null,
                fixed_delivery_price: 0,
                commission: null
            }

        });





    const getProduct = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/product/show/${idd}`)
            console.log({ response }, 'hai')
            setProductList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }



    const getProductTags = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/tag/list`)
            setProductTagList(response?.data?.data)
            setLoader(false)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        }
    }


    useEffect(() => {
        if (idd) {
            getProduct()
        }

    }, [idd])



    // const onChangeSelectType = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelectType(e.target.value)
    //     setValue('type', e.target.value)
    //     setError('type', { message: '' })

    // }


    const StockCheck = (e: any) => {
        if (!view) {
            setValue('stock', e)
            setStock(e)
            setValue('stock_value', '')
        }

    }


    const imageUploder = async (file: any) => {
        if (file.size <= 1000000) {
            setImagefile(file)
            setImagePreview(null)
            setValue('image', file)
            setError('image', { message: '' })
            const formData = new FormData();
            formData.append("image", file);
            try {
                setLoading(true)
                const response = await postData('admin/product/uploadimage', formData)
                setValue('product_image', response?.data?.data)
                setError('product_image', { message: '' })
            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        } else {
            setImagePreview(null)
            setImagefile(null)
            toast.warning('Image should be less than or equal 1MB')
        }


    }


    // const imageUploderThumbnail = async (file: any) => {
    //     console.log('IMAGE ON CHANGE')
    //     console.log({ file },'FGOT FILE')
    //     if (file.size <= 1000000) {
    //         setThumbnailFile(file)
    //         setthumbnailPreview(null)
    //         setValue('thumbnail', file)
    //         setError('thumbnail', { message: '' })
    //         // const formData = new FormData();
    //         // formData.append("image", file);
    //         // try {
    //         //     setLoading(true)
    //         //     const response = await postData('admin/product/uploadimage', formData)
    //         //     setValue('product_image', response?.data?.data)
    //         //     setError('product_image', { message: '' })
    //         // } catch (err: any) {
    //         //     toast.error(err?.message)
    //         //     setLoading(false)
    //         // } finally {
    //         //     setLoading(false)
    //         // }
    //     } else {
    //         setthumbnailPreview(null)
    //         setThumbnailFile(null)
    //         toast.warning('Image should be less than or equal 1MB')
    //     }


    // }

    const multipleImageUploder = async (image: any) => {
        setMultipleImage(image)
        setError('image', { message: '' })
    }








    const getFranchiseList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/franchise/list')
            setFranchiseList(response?.data?.data)

        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }




    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setValue('franchisee', e.target?.value)
        setValue('store', null)
        setError('franchisee', { message: '' })
        setFranchiseSelect(e.target.value)
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)
            //const recomendedProduct = await fetchData(`admin/product/recommended/${process.env.NEXT_PUBLIC_TYPE}/${e.target.value}`)
            setVendorList(response?.data?.data)
            if (response?.data?.data?.length === 1) {
                getRecomentedProducts(response?.data?.data?.[0]?._id)
            }
            // let result = recomendedProduct?.data?.data.map((res: any) => ({
            //     _id: res?._id,
            //     title: `${res?.name}-${res?.product_id}`,
            //     product_id: res?.product_id,
            //     store: res?.store?.name
            // }))
            // setRecomendedProductList(result)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)

        }


    }





    const onSelectStore = (e: React.ChangeEvent<HTMLInputElement>) => {
        getRecomentedProducts(e.target.value)
        setvendorSelect(e.target.value)
        let result = vendorList?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                commision: get?.additional_details ? get?.additional_details.commission : null,
                id: get?._id,
                name: get?.store_name,
                category: get?.category_id
            }

        ))

        setCategoryList(result?.[0]?.category)


        let findresult = vendorList?.filter((res: any) => res?._id === e.target.value)
        console.log(findresult);


        // if(findresult?.length > 0){
        //     getRecomentedProducts(findresult?.[0]?._id)
        // }

        setVendorListDirection(findresult)
        // setValue('commission', result[0]?.commision)     
        setValue('store', e.target.value)
        setError('store', { message: '' })
    }



    const fetchCategoryList = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`/admin/category/list/${process.env.NEXT_PUBLIC_TYPE}`)
            setCategoryList(response?.data?.data)
        }
        catch (err: any) {
            setLoading(false)
            toast.error(err)
        }
        finally {
            setLoading(false)
        }

    }

    const onSelectCategory = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategorySelect(e.target.value)

        setValue('category', e.target.value)
        setError('category', { message: '' })
        setSubCategoryList([])
        try {
            setLoading(true)
            const response = await fetchData(`admin/subcategory-list/${e.target.value}`)
            setSubCategoryList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const onSelectSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubCategorySelect(e.target.value)
        setValue('sub_category', e.target.value)
        setError('sub_category', { message: '' })
    }



    const addAtributes = () => {

        let attributess = [];

        if (attributes && attributes?.length > 0) {
            // attributes?.map((att: object, i: number) => {
            //     attributess.push({
            //         ...att,
            //         id: i+1
            //     })
            // })

            attributess = [...attributes, { id: `${moment().unix()}`, name: '', options: [], variant: false }]
        }
        else {
            attributess = [{ id: `${moment().unix()}`, name: '', options: [], variant: false }]
        }

        setAttributes([...attributess])

        console.log({ attributess })
        // if(attributes?.length  < 2){
        //setAttributes((prev: any) => [...prev, { id: attributess?.length+1, name: '', options: [], variant: false }])
        // }
    }





    const onChangeAttributes = (e: React.ChangeEvent<HTMLInputElement>, i: number, key: string) => {


        //if (!res && !view) {
        // console.log({ attributes })
        attributes[i][key] = e;
        if (key === "options") {
            let result = attributes[i].variant === true;
            if (result) {
                onOptionsChangeaddvarients()
            } else {
                return false;
            }

        }
    }


    const onCheckShipping = (e: boolean) => {
        if (!view) {
            setValue('require_shipping', e)
            setRequireShipping(e)
        }

    }


    const onChangeProductFrom = (e: any) => {

        setValue('product_availability_from', e);


    }

    const onChangeProductTo = (e: any) => {

        setValue('product_availability_to', e);
    }



    const onCheckPandasuggestion = (e: any) => {
        if (!view) {
            setPandaSuggesions(e)
            setValue('panda_suggession', e)
        }

    }

    const onChangeOffer_date_from = (e: any) => {
        setOffer_Date_from(e)

        setValue('offer_date_from', e)
    }

    const onChangeOffer_date_to = (e: any) => {
        setOffer_Date_to(e)
        setValue('offer_date_to', e)

    }



    const onChangeMultipleFoodType = (event: any) => {


        const values = event.target.value;

        setMultipleArrayFoodType(
            values
        );
    }

    const onChangeMultipleProductTag = (event: any) => {


        const values = event.target.value
        // let find = productTagList?.filter((res: any, I: number) => event.target.value.includes(res._id))
        // let data = find?.map((res: any) => res?._id)
        setMultipleArrayProductTag(
            values
        );
    }

    const onSelectCategoryType = (e: any) => {
        const { value } = e.target;
        setProductCategorySelect(value)
    }

    const getRecomentedProducts = async (id: any) => {
        const recomendedProduct = await fetchData(`admin/product/recommended/${process.env.NEXT_PUBLIC_TYPE}/${id}`)
        let result = recomendedProduct?.data?.data.map((res: any) => ({
            _id: res?._id,
            title: `${res?.name}-${res?.product_id}`,
            product_id: res?.product_id,
            store: res?.store?.name
        }))
        setRecomendedProductList(result)
    }

    useEffect(() => {
        if (productList) {
            const getvendorlist = async (vendorId: any) => {
                try {
                    const response = await fetchData(`admin/vendor-list/${productList?.franchisee?._id}/${process.env.NEXT_PUBLIC_TYPE}`)
                    // const recomendedProduct = await fetchData(`admin/product/recommended/${process.env.NEXT_PUBLIC_TYPE}/${productList?.franchisee?._id}`)

                    // let result = recomendedProduct?.data?.data.map((res: any) => ({
                    //     _id: res?._id,
                    //     title: `${res?.name}-${res?.product_id}`,
                    //     product_id: res?.product_id,
                    //     store: res?.store?.name
                    // }))
                    // setRecomendedProductList(result)
                    setVendorList(response?.data?.data)
                    let vendor = response?.data?.data?.find((ven: any) => ven?._id === vendorId)
                    if (vendor) {
                        setCategoryList(vendor?.category_id);
                    }


                    setValue('franchisee', productList?.franchisee?._id)
                } catch (err: any) {
                    toast.error(err?.message)
                }
            }
            const getSubcategory = async () => {
                try {
                    const response = await fetchData(`admin/subcategory-list/${productList?.category?._id}`)
                    setSubCategoryList(response?.data?.data)
                } catch (err: any) {
                    toast.error(err?.message)
                }

            }
            getSubcategory()
            getvendorlist(productList?.store?._id)
            getRecomentedProducts(productList?.store?._id)
            setCategorySelect(productList?.category?._id)


            setStatusSelect(productList?.approval_status)
            setRecomendedProductEditList(productList?.related_products ? productList?.related_products : [])
            setMultipleArrayFoodType(productList?.food_type ? productList?.food_type : [])
            setMultipleArrayProductTag(productList?.product_tags ? productList?.product_tags : [])
            setProductCategorySelect(productList?.category_type)
            setValue('name', productList?.name)
            setValue('franchisee', productList?.franchisee?._id)
            setFranchiseSelect(productList?.franchisee?._id)
            setValue('store', productList?.store?._id)
            setvendorSelect(productList?.store?._id)
            setValue('description', productList?.description)
            setValue('weight', productList?.weight)
            setValue('model', productList?.model)
            setValue('width', productList?.dimensions?.width)
            setValue('height', productList?.dimensions?.height)
            setValue('category', productList?.category?._id)
            setValue('sub_category', productList?.sub_category?._id)
            setSubCategorySelect(productList?.sub_category?._id)
            setValue('display_order', productList?.display_order)
            setValue('panda_suggession', productList?.panda_suggession)
            setPandaSuggesions(productList?.panda_suggession)
            setValue('stock', productList?.stock)
            setStock(productList?.stock)
            setValue('stock_value', productList?.stock_value)
            setValue('minimum_qty', productList?.minimum_qty)
            setImagePreview(`${IMAGE_URL}${productList?.product_image}`)
            let paths = productList?.delivery_locations?.map((loc: any) => {
                return {
                    lat: parseFloat(loc[0]),
                    lng: parseFloat(loc[1])
                }
            })
            setPaths(paths)
            setValue('delivery_locations', productList?.delivery_locations)

            setValue('product_availability_from', productList?.product_availability_from ? moment(productList?.product_availability_from, 'HH:mm') : null)
            setValue('product_availability_to', productList?.product_availability_to ? moment(productList?.product_availability_to, 'HH:mm') : null)
            setValue('require_shipping', productList?.require_shipping)
            setRequireShipping(productList?.require_shipping)
            if (productList?.meta_tags) {
                setMetaTag(productList?.meta_tags)
            }
            setValue('video_link', productList?.video_link)
            setValue('related_products', productList?.related_products)
            setValue('product_image', productList?.product_image)
            if (productList?.image) {
                let imageslist = productList?.image?.map((res: any) => (
                    res

                ))
                setdefaultImage([...imageslist])
            }


            let attributesArray: { name: any; options: any; variant: boolean; }[] = []
            if (productList?.attributes?.length > 0) {
                productList?.attributes.map((item: any) => {
                    attributesArray.push({
                        name: item?.name,
                        options: item?.options,
                        variant: item?.variant,
                       
                    })


                })
                setAttributes([...attributesArray])
            }

            let myvaarientArray: { title: any; variant_id: string; attributs: any; seller_price: any; regular_price: string; offer_price: string; offer_date_from: any; offer_date_to: any; stock: boolean; stock_value: string; commission: number; fixed_delivery_price: number; }[] = []

            if (productList?.variants?.length > 0) {
                productList?.variants?.map((item: any) => {
                    myvaarientArray.push({
                        variant_id: item._id,
                        title: item?.title,
                        attributs: item?.attributs,
                        seller_price: item?.seller_price,
                        regular_price: (item?.regular_price && item?.regular_price > 0) ? item?.regular_price : null,
                        offer_price: (item?.offer_price && item?.offer_price > 0) ? item?.offer_price : null,
                        offer_date_from: (item?.offer_date_from && moment(item?.offer_date_from, 'YYYY-MM-DD').isValid()) ? moment(item?.offer_date_from, 'YYYY-MM-DD') : null,
                        offer_date_to: (item?.offer_date_to && moment(item?.offer_date_to, 'YYYY-MM-DD').isValid()) ? moment(item?.offer_date_to, 'YYYY-MM-DD') : null,
                        // stock: item?.stock,
                        stock: productList?.stock,
                        stock_value: item?.stock_value,
                        commission: (item?.commission && item?.commission > 0) ? item?.commission : null,
                        fixed_delivery_price: (item?.fixed_delivery_price && item?.fixed_delivery_price > 0) ? item?.fixed_delivery_price : null
                    })

                })

                setTimeout(() => {
                    setVarientsArray(myvaarientArray)
                }, 500);

            }
            setValue('commission', productList?.commission ? productList?.commission : null)
            setValue('regular_price', productList?.regular_price ? productList?.regular_price : null)
            setValue('seller_price', productList?.seller_price ? productList?.seller_price : null)
            setValue('offer_price', productList?.offer_price ? productList?.offer_price : null)
            // setOffer_Date_from(moment(productList?.offer_date_from, 'YYYY-MM-DD'))
            // setOffer_Date_to(moment(productList?.offer_date_from, 'YYYY-MM-DD'))
            setValue('offer_date_from', productList?.offer_date_from ? moment(productList?.offer_date_from, 'YYYY-MM-DD') : null)
            setValue('offer_date_to', productList?.offer_date_to ? moment(productList?.offer_date_to, 'YYYY-MM-DD') : null)
            setValue('fixed_delivery_price', productList?.fixed_delivery_price)

        }

    }, [productList])


    useEffect(() => {
        getFranchiseList()
        // fetchCategoryList()
        getProductTags()
    }, [])


    useEffect(() => {
        if (attributeTagValue?.length) {
            attributes[index].options = [...attributeTagValue]
        }
    }, [attributeTagValue])


    const onPolygonComplete = (value: any) => {
        setValue("delivery_locations", value)
    }





    //varient add varients and attributes form.......................................................................

    // useEffect(() => {

    //     addvarients()

    // }, [attributes, index])


    // const AddVarientCheckbox = (e: any, i: number) => {
    //     setIndex(i)
    //     attributes[i].varient = e;
    //     //setAddVarient(e)
    //     addvarients()
    // }

    const enableVariant = (e: any, i: number) => {
        if (!res && !view) {
            setVarientsArray([])
            //setVarients
            setIndex(i)
            attributes[i].variant = e;
            setAttributes([...attributes])
            //setAddVarient(e)
            addvarients(attributes)
        }

    }

    const combine: any = ([head, ...[headTail, ...tailTail]]: any) => {
        if (!headTail) return head

        const combined = headTail.reduce((acc: any, x: any) => {
            return acc.concat(head.map((h: any) => `${h} ${x}`))
        }, [])

        return combine([combined, ...tailTail])
    }

    const onOptionsChangeaddvarients = () => {
        if (attributes?.some((res: any) => res?.variant === true)) {
            const output = [];
            setValue('seller_price', '')
            setValue('offer_price', '')
            setValue('offer_date_from', '')
            setValue('regular_price', null)
            setValue('offer_date_to', '')
            setValue('fixed_delivery_price', '')
            // Filter attributes array to only include those with variant true
            const variantAttributes = attributes?.filter((attr: any) => attr.variant !== false)

            let attributesArray = variantAttributes?.map((vari: any) => vari?.options)



            let combines = combine(attributesArray);

            // console.log({ combines, varientsarray })

            let attri = combines.map((val: any) => {
                return {
                    title: val,
                    attributs: val.split(' '),
                    seller_price: '',
                    regular_price: null,
                    offer_price: '',
                    offer_date_from: '',
                    offer_date_to: '',
                    stock: stock,
                    stock_value: '',
                    commission: null,
                    fixed_delivery_price: null
                }
            })

            // console.log({ varientsarray, attri })


            let varia = varientsarray?.filter((obj: any) => {
                return attri.some((obj1: any) => obj.title === obj1.title)
            })

            const result = attri?.filter((obj: any) => {
                return !varientsarray.some((obj1: any) => obj.title === obj1.title)
            })

            //filter results


            setVarientsArray([...varia, ...result])
            // console.log({ varientsarray })

        } else {
            setVarientsArray([])
            setVarients([])
        }
    }





    const addvarients = (attributes: any) => {
        console.log({ attributes }, "vari")
        if (attributes?.some((res: any) => res?.variant === true)) {
            const output = [];
            setValue('seller_price', '')
            setValue('offer_price', '')
            setValue('offer_date_from', '')
            setValue('regular_price', null)
            setValue('offer_date_to', '')
            setValue('fixed_delivery_price', '')
            // Filter attributes array to only include those with variant true
            const variantAttributes = attributes?.filter((attr: any) => attr.variant !== false)

            let attributesArray = variantAttributes?.map((vari: any) => vari?.options)



            let combines = combine(attributesArray);

            let attri = combines.map((val: any, i: number) => {
                return {
                    id: `${i}${moment().unix()}`,
                    title: val,
                    attributs: val.split(' '),
                    seller_price: '',
                    regular_price: null,
                    offer_price: '',
                    offer_date_from: '',
                    offer_date_to: '',
                    stock: stock,
                    stock_value: '',
                    commission: null,
                    fixed_delivery_price: 0
                }
            })

            console.log({ attri })
            setVarientsArray([...attri])
        } else {
            setVarientsArray([])
            setVarients([])
        }
    }



    useEffect(() => {
        addvarients(attributes)
    }, [index, attributes])





    //remove multiple image function only for edit.........................................................

    const removeImage = (name: string) => {
        const result = defaultImage?.filter((res: any) => res !== name)
        setdefaultImage([...result])

    }

    const changeAttributeValues = (i: number, key: string, values: any) => {
        varientsarray[i][key] = values
        if (stock) {
            varientsarray[i]['stock'] = stock;
        }

        setVarientsArray([...varientsarray])
        console.log({ varientsarray }, 'haii')
    }


    //seach_T/admin/vendor-list/650d671e97a01b7e46078cb7/pandaag..............................................................................................

    const searchTagvalues = (res: any) => {
        setSearchTag(res)

    }

    //metatag value..........................................................................................

    const metaTagvalues = (res: any) => {

        console.log({ res })
        setMetaTag(res)
        setValue('meta_tags', res)
    }

    const onChangeRelatedproduct = (value: any) => {
        let result = value && value?.map((res: any) => ({
            _id: res?._id,
            name: res?.title
        }
        ))

        setRecomendedProductArray(result)
    }


    const deleteRelatedProduct = (id: any) => {
        let result = recomendedProductEditList?.filter((res: any) => res?._id !== id)
        setRecomendedProductEditList(result)

    }


    //posting products ...................................................................................................

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {



        //return false;
        //Check All Attributes have values
        let attributeCheck = attributes?.find((att: any) => isEmpty(att?.name) || att?.options?.length === 0);
        // console.log({ attributeCheck, attributes })
        if (attributeCheck) {
            toast.warning("All Attributes must have values")
            return false;
        }
        let pattern = /^[0-9]+$/
        //Check Any Variants
        let variantsChe = attributes?.find((att: any) => att.variant === true);
        // console.log({ length: attributes.length, price: isEmpty(data?.seller_price) })
        if (!variantsChe && varientsarray?.length === 0) {
            if (isNaN(data?.seller_price) || data?.seller_price <= 0) {
                setError("seller_price", { type: 'custom', message: 'Purchase price must be greater than 0' })
                return false;
            }
            let regularPrice = parseInt(data?.regular_price);
            // console.log({ regularPrice })
            if (data?.regular_price) {
                if (isNaN(regularPrice)) {
                    setError("regular_price", { type: 'custom', message: ' Price must be a number' })
                    return false;
                }
            }

            // if(data?.regular_price<=0){
            //     setError("regular_price", { type: 'custom', message: 'Selling price must be a greater than 0' })
            //     return false;
            // }
            // if(data?.commission<=0){
            //     setError("commission", { type: 'custom', message: 'Commission  must be a greater than 0' })
            //     return false;
            // }
            if (!isEmpty(data?.offer_price)) {
                if (isNaN(data?.offer_price)) {
                    setError("offer_price", { type: 'custom', message: 'Offer price must be a number' })
                    return false;
                }

                // else if (!data?.offer_date_from || !data?.offer_date_to) {
                //     toast.warning("Offer From date and to date required")
                //     return false;

                // }
                else {
                    if (data.offer_date_to && data.offer_date_from === ("" || null)) {
                        toast.warning(" Offer from date is required");
                        return false;
                    }

                }

            }


            if (isNaN(data?.fixed_delivery_price) || isEmpty(data?.fixed_delivery_price) || data?.fixed_delivery_price < 0) {
                setError("fixed_delivery_price", { type: 'custom', message: 'delivery price required' })
                return false;
            }
            //setError("seller_price", { type: 'custom', message: 'Purchase price required' })
            //console.log({delivery: data?.fixed_delivery_price})
        }
        else {

            // console.log({ varientsarray })
            let varicheck = varientsarray?.find((vari: any) => isEmpty(vari?.seller_price) || isNaN(vari?.seller_price) || (isNumber(vari?.seller_price) && vari?.seller_price >= 0))
            if (varicheck) {
                // console.log({ varicheck, varientsarray })
                toast.warning("All variants mush have price. Please update price and continue")
                return false;
            }
            else {
                // let offer = varientsarray?.filter((vari: any) => !isEmpty(vari?.offer_price))
                // if (offer) {
                //     let offerpr = offer?.find((off: any) => !off.¸ || !off?.offer_date_to);
                //     if (offerpr) {
                //         toast.warning("Offer From date and to date required")
                //         return false;
                //     }
                // }

                varientsarray.map((item: any) => {
                    if (item.offer_date_to && item.offer_date_from === "") {
                        toast.warning(" Offer from date is required");
                        return false;
                    }
                });



                if (stock) {
                    // let stockValue = varientsarray?.every((vari: any) => vari?.stock_value !== '')  
                    const stockValue = varientsarray.some((product: any) => parseInt(product.stock_value) < 0 || product.stock_value === (null || '') || isNaN(product.stock_value));


                    //  console.log({stockValue})
                    //  console.log({varientsarray})
                    if (stockValue) {
                        toast.warning("Stock value required for all variants")
                        return false;
                    }
                }

                let delivery = varientsarray?.find((vari: any) => isNaN(vari?.fixed_delivery_price) || vari?.fixed_delivery_price < 0 || isEmpty(vari?.fixed_delivery_price))
                // console.log({ delivery })
                if (delivery) {
                    toast.warning("Delivery price required for all variants")
                    return false;
                }

            }
        }



        let franchiseData = franchiseList?.filter((res: any) => res?._id === franchiseSelect).map((get: any) => (
            {
                id: get?._id,
                name: get?.franchise_name
            }
        ))



        let categoryData = categoryList?.filter((res: any) => res?.id === categorySelect).map((get: any) => (
            {
                id: get?.id,
                name: get?.name,
                image: get?.image
            }
        ))


        let subCategoryData = subcategoryList?.filter((res: any) => res?._id === subcategorySelect).map((get: any) => (
            {
                id: get?._id,
                name: get?.name
            }
        ))



        let vendorData = vendorList?.filter((res: any) => res?._id === vendorSelect).map((get: any) => (
            {
                commision: get?.additional_details ? get?.additional_details.commission : null,
                id: get?._id,
                name: get?.store_name
            }
        ))



        //below code help to remove duplicates from array.............................

        let recomendedProductList: any = []



        const recomendedProduct = recomendedProductArray?.filter((obj: any) => {
            return !recomendedProductEditList?.some((obj1: any) => obj._id === obj1._id)
        })



        if (recomendedProduct?.length > 0) {
            recomendedProductList?.push(...recomendedProduct)
            recomendedProductList?.push(...recomendedProductEditList)
        }



        let imagearray: any = []
        if (multipleImage?.length > 0) {
            const formData = new FormData();
            multipleImage?.map((img: any, i: number) => {
                formData.append(`image[${i}]`, img.file);
            })
            try {
                setLoading(true)
                const response = await postData('admin/product/multipleupload', formData)
                setValue('image', response?.data?.data)
                if (defaultImage?.length > 0 && res) {
                    imagearray = [...response?.data?.data, ...defaultImage]
                } else {
                    imagearray = response?.data?.data
                }
                setError('image', { message: '' })
            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)

            } finally {
                setLoading(false)
            }

        }
        //to FILTER THE EMPTY OBJECTS FROM AN vARIENT ARRAY...............
        let varientarrayfilter = null
        varientarrayfilter = varientsarray?.length > 0 && varientsarray?.filter((vari: any) => vari.seller_price !== '')

        console.log({varientsarray})

        let varrientsWithDate = []
        if (varientsarray) {
            varrientsWithDate = varientsarray?.map((res: any) => ({
                ...res,
                offer_date_from: moment(res?.offer_date_from, "YYYY-MM-DD").isValid() ? moment(res?.offer_date_from).format('YYYY-MM-DD') : null,
                offer_date_to: moment(res?.offer_date_to, "YYYY-MM-DD").isValid() ? moment(res?.offer_date_to).format('YYYY-MM-DD') : null
            }))
        }




        const CREATE_URL = '/admin/product/create'
        const EDIT_URL = 'admin/product/update'



        let value: any = {
            name: data?.name,
            franchisee: {
                _id: franchiseData?.[0]?.id,
                name: franchiseData?.[0]?.name
            },
            description: data?.description,
            store: {
                _id: vendorData?.[0]?.id,
                name: vendorData?.[0]?.name
            },
            weight: data?.weight,
            dimensions: {
                width: data?.width,
                height: data?.height
            },
            model: data?.model,
            category_type: productCategorySelect,
            food_type: multpleArrayFoodType,
            type: process.env.NEXT_PUBLIC_TYPE,
            product_tags: multpleArrayProductTag,
            product_type: null,
            image: imagearray?.length > 0 ? imagearray : defaultImage,
            product_image: data?.product_image,
            category: {
                _id: categoryData?.[0]?.id,
                name: categoryData?.[0]?.name,
                image: categoryData?.[0]?.image
            },
            sub_category: data?.sub_category ? {
                _id: subCategoryData?.[0]?.id,
                name: subCategoryData?.[0]?.names
            } : null,
            display_order: (data?.display_order && data?.display_order > 0) ? parseInt(data?.display_order) : null,
            panda_suggession: data?.panda_suggession,
            stock: data?.stock,
            stock_value: data?.stock_value,
            minimum_qty: data?.minimum_qty,
            product_availability_from: data?.product_availability_from ? moment(data?.product_availability_from, 'hh:mm A').format('HH:mm') : null,
            product_availability_to: data?.product_availability_to ? moment(data?.product_availability_to, 'hh:mm A').format('HH:mm') : null,
            require_shipping: data?.require_shipping,
            delivery_locations: data?.delivery_locations ? data?.delivery_locations : vendorlistDirection?.[0]?.delivery_location,
            coupon_details: null,
            meta_tags: metaTag,
            video_link: data?.video_link,
            related_products: recomendedProductList?.length > 0 ? recomendedProductList : recomendedProductEditList,
            attributess: attributes,
            regular_price: data?.regular_price,
            seller_price: data?.seller_price,
            offer_price: data?.offer_price,
            commission: data?.commission ? data?.commission : null,
            fixed_delivery_price: data?.fixed_delivery_price,
            offer_date_from: data?.offer_date_from ? moment(data?.offer_date_from, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            offer_date_to: data?.offer_date_to ? moment(data?.offer_date_to, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            variant: varrientsWithDate?.length > 0 ? true : false,
            variants: varrientsWithDate?.length > 0 ? varrientsWithDate : null,
            approval_status: statusSelect ? statusSelect : 'approved'
        }
        if (productList) {
            value["id"] = productList?._id;
        }

        try {
            setLoading(true)
            await postData(idd ? EDIT_URL : CREATE_URL, value)
            toast.success(idd ? 'Edited Successfully' : 'Created Successfully')
            reset()
            setFranchiseSelect(null)
            setCategorySelect(null)
            //setSelectType(null)
            setImagefile(null)
            setSubCategorySelect(null)
            setvendorSelect(null)
            //setConfirmBtn(false)
            setVarientsArray([])
            setMetaTag([])
            setattributeTag([])
            setAttributes([])
            setRequireShipping(false)
            setMultipleImage([])
            router?.push('/products')
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)

        } finally {

            setLoading(false)
        }
    }

    const removeAttributes = async (id: number) => {
        // console.log('FUCTION CALLED')

        if (!res || !view) {
            let newAttri = await attributes?.filter((att: any) => att.id !== id)
            // attributes[i].variant = false;
            // setAttributes([...attributes])
            // let attribute = await attributes?.filter((att: any, index: Number) => index !== i)

            // let attribu: Array<any> = [];

            // await newAttri?.map((att: any, index: number) => {
            //     attribu.push({
            //         ...att,
            //         id: index + 1
            //     })

            // })


            //console.log({attribu})
            //setAttributes(null)

            await setAttributes([...newAttri])
            addvarients(newAttri)

        }


    }

    const ChangeStatus = useCallback((e: any) => {
        const { value } = e.target;
        setStatusSelect(value)
    }, [])



    if (loader) {
        return <><CustomLoader /></>
    }

    return (
        <Box>
            <CustomBox title='Product Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Product Name"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.franchisee}
                            fieldName="franchisee"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={franchiseSelect}
                            options={''}
                            onChangeValue={onselectFranchise}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Franchise</>
                            </MenuItem>
                            {franchiseList && franchiseList?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
                                <MenuItem value={res?._id}>{res?.franchise_name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={view ? true : false ? getValues('franchisee') ? false : true : false}
                            type='text'
                            control={control}
                            error={errors.store}
                            fieldName="store"
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
                            {vendorList && vendorList?.map((res: any) => (
                                <MenuItem value={res?._id}>{res?.store_name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Product Description"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>

                    {process?.env?.NEXT_PUBLIC_TYPE === "panda" && <>
                        <Grid item xs={12} lg={3}>
                            <CustomMultiselect
                                multiple={true}
                                control={control}
                                error={errors.food_type}
                                fieldName="food_type"
                                placeholder={``}
                                fieldLabel={"Food Type"}
                                readOnly={view ? true : false}
                                value={multpleArrayFoodType}
                                onChangeValue={onChangeMultipleFoodType}
                                type=''
                            >
                                <MenuItem value="" disabled >
                                    <>Select Category</>
                                </MenuItem>
                                {productType && productType.map((res: any) => (
                                    <MenuItem value={res?.value}>{res?.name}</MenuItem>
                                ))}
                            </CustomMultiselect>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <CustomMultiselect

                                multiple={true}
                                control={control}
                                error={errors.product_tags}
                                fieldName="product_tags"
                                placeholder={``}
                                fieldLabel={"Product Tags"}
                                readOnly={view ? true : false}
                                value={multpleArrayProductTag}
                                onChangeValue={onChangeMultipleProductTag}
                                type=''
                            >
                                <MenuItem value="" disabled >
                                    <>Select Category</>
                                </MenuItem>
                                {productTagList && productTagList.map((res: any) => (
                                    <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                                ))}
                            </CustomMultiselect>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <Customselect
                                type='text'
                                control={control}
                                error={errors.category_type}
                                fieldName="category_type"
                                placeholder={``}
                                fieldLabel={"Category Type"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={productCategorySelect}
                                options={''}
                                onChangeValue={onSelectCategoryType}
                                background={'#fff'}
                                disabled={view ? true : false}
                            >
                                <MenuItem value="">select Category Type</MenuItem>
                                {product_category?.map((res: any) => (
                                    <MenuItem value={res?.value}>{res?.name}</MenuItem>
                                ))}

                            </Customselect>
                        </Grid>
                    </>}
                    <Grid item xs={12} lg={1.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.weight}
                            fieldName="weight"
                            placeholder={``}
                            fieldLabel={"Weight(kg)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.model}
                            fieldName="model"
                            placeholder={``}
                            fieldLabel={"Model"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.width}
                            fieldName="width"
                            placeholder={`width`}
                            fieldLabel={"Dimensions"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.height}
                            fieldName="height"
                            placeholder={`Height`}
                            fieldLabel={"*"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>


                    {vendorSelect &&
                        <Grid item xs={12} lg={3}>
                            <Customselect
                                type='text'
                                control={control}
                                error={errors.category}
                                fieldName="category"
                                placeholder={``}
                                fieldLabel={"Category"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={categorySelect}
                                options={''}
                                onChangeValue={onSelectCategory}
                                background={'#fff'}
                                disabled={view ? true : false}
                            >
                                <MenuItem value=""></MenuItem>
                                {categoryList && categoryList?.map((res: any) => (
                                    <MenuItem value={res?.id}>{res?.name}</MenuItem>
                                ))}

                            </Customselect>
                        </Grid>}

                    {subcategoryList?.length > 0 && <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={view ? true : false ? getValues('category') ? false : true : false}
                            type='text'
                            control={control}
                            error={errors.sub_category}
                            fieldName="sub_category"
                            placeholder={``}
                            fieldLabel={"SubCategory"}
                            selectvalue={""}
                            height={40}
                            label={''}

                            size={16}
                            value={subcategorySelect}
                            options={''}
                            onChangeValue={onSelectSubCategory}
                            background={'#fff'}
                        >
                            {subcategoryList && subcategoryList?.map((res: any) => (
                                <MenuItem value={res?._id}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>}
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.display_order}
                            fieldName="display_order"
                            placeholder={``}
                            fieldLabel={"Display Order(Homepage)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={pandaSuggesion} label='' onChange={onCheckPandasuggestion} title='Panda Suggestion' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={stock} label='' onChange={StockCheck} title='Enable Stock' />
                    </Grid>
                    {stock &&
                        varientsarray?.length === 0 &&
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.stock_value}
                                fieldName="stock_value"
                                placeholder={``}
                                fieldLabel={"Stock"}
                                disabled={false}
                                view={view ? true : false}
                                defaultValue={''}
                            />
                        </Grid>}
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.minimum_qty}
                            fieldName="minimum_qty"
                            placeholder={``}
                            fieldLabel={"Minimum Quantity (Optional)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>

                    {view &&
                        <Grid item xs={12} lg={3}>
                            <Avatar variant='square' src={`${IMAGE_URL}${productList?.product_image}`} sx={{ width: '100%', height: 130 }} />
                        </Grid>}
                    {!view &&
                        <Grid item xs={12} lg={3}>
                            <CustomImageUploader
                                ICON={""}
                                viewImage={imagePreview}
                                error={errors.product_image}
                                fieldName="image"
                                placeholder={``}
                                fieldLabel={"Product Image"}
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
                </Grid>
            </CustomBox>
            <CustomBox title='Delivery Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={requireShipping} label='' onChange={onCheckShipping} title='Requires Shipping' />
                    </Grid>
                    {!getValues('require_shipping') &&
                        <Grid item xs={12} lg={2}>
                            <CustomTimepicker
                                disabled={view ? true : false}
                                changeValue={onChangeProductFrom}
                                fieldName='product_availability_from'
                                control={control}

                                error={errors.product_availability_from}
                                fieldLabel={'Product Availability'} />
                        </Grid>}
                    {!getValues('require_shipping') &&
                        <Grid item xs={12} lg={2}>
                            <Typography mb={3}></Typography>
                            <CustomTimepicker
                                disabled={view ? true : false}
                                changeValue={onChangeProductTo}
                                fieldName='product_availability_to'
                                control={control}
                                error={errors.product_availability_to}
                                fieldLabel={''} />
                        </Grid>}

                </Grid>
                <Box py={2}>
                    <Divider />
                    {productList && productList?.delivery_locations ? <Polygon onComplete={onPolygonComplete} path={paths} /> :
                        <Maps onPolygonComplete={onPolygonComplete} />}
                    {(errors && errors?.delivery_locations) && <span style={{ color: 'red', fontSize: 12 }}>{`${errors?.delivery_locations?.message}`}</span>}
                </Box>
            </CustomBox>
            <CustomBox title='Additional Options'>
                <Grid container spacing={2}>
                    {view && <Grid item xs={12} lg={6}>
                        <Typography letterSpacing={.5} px={'3px'} mb={'3px'}
                            sx={{
                                fontSize: {
                                    lg: 16,
                                    md: 14,
                                    sm: 12,
                                    xs: 11,
                                },
                                fontFamily: `'Poppins' sans-serif`,

                            }}
                        >{'Meta Tags'}

                        </Typography>
                        <Box style={{ border: '0.5px solid black', minHeight: 25, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }} p={.5}>
                            {metaTag?.map((tag: any, index: number) => <Box key={index} style={{ backgroundColor: '#ebf0f7', padding: 5, margin: 2, display: 'flex', flexDirection: 'row', height: 25, fontSize: 12, alignItems: 'center' }}>
                                <span>{tag}</span>

                            </Box>)}
                        </Box>
                    </Grid>}
                    {!view &&
                        <Grid item xs={12} lg={6}>
                            <CustomTagInputValue fieldLabel='Meta Tags' tagValues={(metaTagvalues)} values={metaTag} setState={setMetaTag} />
                        </Grid>}
                    {/* {!view &&
                        <Grid item xs={12} lg={3}>
                            <CustomTagInputValue fieldLabel='Search Tags' tagValues={(searchTagvalues)} values={searchTag} setState={setMetaTag} />
                        </Grid>} */}

                    <Grid item xs={12} lg={3}>
                        <CustomInput

                            type='text'
                            control={control}
                            error={errors.video_link}
                            fieldName="video_link"
                            placeholder={`https://www.youtube.com/watch?v=FrSg03rpnkM`}
                            fieldLabel={"Product Video Link (Only Youtube Video)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={3}>
                        <CustomImageUploader
                            ICON={""}
                            viewImage={thumbnailPreview}
                            error={errors.thumbnail}
                            fieldName="thumbnail"
                            placeholder={``}
                            fieldLabel={"Thumbnail"}
                            control={control}
                            height={130}
                            max={5}
                            onChangeValue={imageUploderThumbnail}
                            preview={thumbnailfile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"100%"}
                        />
                    </Grid> */}
                    <Grid item xs={12} lg={6}>

                        {/* this only in edit image code ************************************** */}

                        {defaultImage.length > 0 && !view &&
                            <>
                                <Box display={'flex'} gap={2} style={{ height: '200px', overflow: 'auto' }} >
                                    {defaultImage && defaultImage?.map((res: any, i: number) => (
                                        <Box position={'relative'}>
                                            <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 100, height: 100, }} />
                                            <Box position={'absolute'} top={0} right={0}><HighlightOffIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => removeImage(res)} /></Box>
                                        </Box>

                                    ))}
                                </Box>
                            </>
                        }


                        {view &&
                            <div style={{ height: '200px', overflow: 'auto' }}>
                                <>
                                    <Typography letterSpacing={0.5} px={3} mb={3}
                                        sx={{
                                            fontSize: {
                                                lg: 16,
                                                md: 14,
                                                sm: 12,
                                                xs: 11,
                                            },
                                            fontFamily: `'Poppins' sans-serif`,
                                        }}
                                    >{'Additional Images'}</Typography>
                                    <Box display="flex" gap={2}>
                                        {defaultImage && defaultImage.map((res: any, i: number) => (
                                            <Box key={i}>
                                                <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 130, height: 130 }} />
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            </div>
                        }

                        {/* {!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />} */}
                        <div style={{ height: '200px', overflow: 'auto' }}>
                            {!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />}
                        </div>

                    </Grid>
                    <Grid item xs={12} lg={6}>
                        {view &&
                            <>
                                <Typography letterSpacing={.5} px={'3px'} mb={'3px'}
                                    sx={{
                                        fontSize: {
                                            lg: 16,
                                            md: 14,
                                            sm: 12,
                                            xs: 11,
                                        },
                                        fontFamily: `'Poppins' sans-serif`,

                                    }}
                                >{"Related Products"}

                                </Typography>

                                <Box display={'flex'} sx={{ gap: 1 }} flexWrap={'wrap'} >
                                    {recomendedProductEditList?.map((res: any) => (
                                        <Typography p={1} sx={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', gap: 1 }}>{res?.name}</Typography>))}
                                </Box>
                            </>
                        }
                        {productList &&
                            <>
                                <Box display={'flex'} sx={{ gap: 1 }} flexWrap={'wrap'} py={1} >
                                    {recomendedProductEditList?.map((res: any) => (
                                        <Typography p={.5} sx={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', gap: 1 }}>{res?.name}<ClearIcon onClick={() => deleteRelatedProduct(res?._id)} sx={{ fontSize: '18px', color: 'red', cursor: 'pointer' }} /></Typography>))}
                                </Box>

                            </>
                        }


                        {!view && <CustomAutoCompleteSearch onChange={onChangeRelatedproduct} list={recomendedProductList} fieldLabel={"Related Products"} />}
                    </Grid>
                </Grid>
            </CustomBox>

            <CustomBox title='Attributes'>
                {!res && !view &&
                    <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={addAtributes} IconEnd={''} IconStart={AddIcon} />}
                {attributes && attributes?.map((res: any, i: any) =>
                    <Attributes key={res?.id} item={res} index={i} onChange={onChangeAttributes} enableVariant={enableVariant} closeIcon={idd ? false : true} removeAttributes={!productList ? removeAttributes : null} />
                )}
            </CustomBox>

            {varientsarray?.length === 0 && <CustomBox title='Price'>
                <Grid container spacing={2}>
                    <Grid item lg={1.71} xs={12}>
                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.seller_price}
                            fieldName="seller_price"
                            placeholder={``}
                            fieldLabel={"Purchase Price"}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={1.71} xs={12}>

                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.regular_price}
                            fieldName="regular_price"
                            placeholder={``}
                            fieldLabel={"Selling Price"}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomInput
                            disabled={false}
                            type='number'
                            control={control}
                            error={errors.commission}
                            fieldName="commission"
                            placeholder={''}
                            fieldLabel={"Commission(%)"}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.fixed_delivery_price}
                            fieldName="fixed_delivery_price"
                            placeholder={``}
                            fieldLabel={"Delivery Price"}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.offer_price}
                            fieldName="offer_price"
                            placeholder={``}
                            fieldLabel={"Offer Price"}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomDatePicker
                            disabled={view ? true : false}
                            values={offerDate_from ? offerDate_from : getValues('offer_date_from')}
                            changeValue={onChangeOffer_date_from}
                            fieldName='offer_date_from'
                            past={false}
                            control={control}
                            error={errors.offer_date_from}
                            fieldLabel={'Offer From'}
                        />

                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomDatePicker
                            disabled={view ? true : false}
                            values={offerDate_to ? offerDate_to : getValues('offer_date_to')}
                            changeValue={onChangeOffer_date_to}
                            fieldName='offer_date_to'
                            control={control}
                            past={false}
                            error={errors.offer_date_to}
                            fieldLabel={'Offer To'}
                        />

                    </Grid>



                </Grid>
            </CustomBox>}
            {varientsarray && varientsarray.length > 0 && <CustomBox title='Add Variant & Price'>
                {varientsarray?.map((varian: any, i: number) => <CustomProductVarient key={varian?.id} view={view} deafultCommission={getValues('commission')} content={varian} index={i} onChange={(value: any, key: string) => changeAttributeValues(i, key, value)} setState={undefined} state={varientsarray} stock={stock} />)}
            </CustomBox>}

            {/* {attributes?.some((res: any) => res.varient === true) &&
                <CustomBox title='Add Variant & Price'>
                    {attributes?.some((res: any) => res.varient === true) &&
                        <Box>
                            {varients?.map((res: any, i: any) => (
                                <CustomProductVarient deafultCommission={getValues('commission')} content={res} index={i} setState={setVarientsArray} state={varientsarray} />
                            ))}
                        </Box>
                    }
                </CustomBox>} */}


            {productList?.approval_status !== 'approved' && idd && <CustomBox title='Change Status'>
                <Grid container spacing={2}>
                    <Grid item lg={2} md={2} xs={12}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.approval_status}
                            fieldName="approval_status"
                            placeholder={``}
                            fieldLabel={"Status Change"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={statusSelect}
                            options={''}
                            onChangeValue={ChangeStatus}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <em>Change Status</em>
                            </MenuItem>
                            {statusChange.map((res: any) => (
                                <MenuItem value={res?.value}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                </Grid>



            </CustomBox>}
            {!view &&
                <Box py={3}>
                    <Custombutton
                        disabled={loading}
                        btncolor=''
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={res ? 'Update' : 'Add Product'}
                        onClick={handleSubmit(onSubmit)} />
                </Box>}
        </Box>
    )
}

export default ProductForm












