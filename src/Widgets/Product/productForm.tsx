import { Avatar, Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomImageUploader from '@/components/CustomImageUploader';
import CustomAutoComplete from '@/components/CustomAutocompleteBox';
import CustomTimepicker from '@/components/CustomTimepicker';
import { GoogleMap, useJsApiLoader, LoadScript, Marker, DrawingManager } from "@react-google-maps/api";
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
import { type } from 'os';
import { isEmpty, isNull, isNumber } from 'lodash';
import Polygon from '@/components/maps/Polygon';
import { IMAGE_URL } from '../../Config/index';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TagInput from '@/components/TagInput'
import Attributes from './Attributes'
import { useRouter } from 'next/router';
import CustomTagInputValue from '@/components/CustomTagInputValue';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import ClearIcon from '@mui/icons-material/Clear';
import CustomLoader from '@/components/CustomLoader';
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
    fixed_delivery_price: any
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
    fixed_delivery_price: any
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
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [attributes, setAttributes] = useState<any>([])
    const [metaTag, setMetaTag] = useState<any>([])
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

    console.log({ stock })

    const orderValidation = /^[0-9]*$/
    const schema = yup
        .object()
        .shape({

            name: yup.string().required('Product Name Required'),
            // display_order: yup.number().nullable().typeError("Must be Integer"),
            display_order: yup.string().matches(orderValidation, 'Accept only positive number').nullable(),
            franchisee: yup.string().typeError('Franchise is Required').required('Franchise is Required'),
            store: yup.string().typeError('Store is Required').required('Store is Required'),
            stock: yup.boolean(),
            category: yup.string().typeError('Category is Required').required('Category is Required'),
            delivery_locations: yup.array().typeError('Delivery location is Required').required('Delivery location is Required'),
            product_image: yup
                .mixed()
                .required("Product Image is Required"),
            stock_value: (stock === true && varientsarray?.length === 0) ? yup.string().matches(orderValidation, 'Accept only positive number').required("Stock value required").typeError("Stock value must be a number") : yup.string().nullable(),
            // regular_price: attributes?.every((res: any) => res?.varients === false) ? yup.string().required('Purchase Price is Required') : yup.string()

            // meta_tags: yup.array().typeError('Meta Tags is Required').required('Meta Tag is Required')
            minimum_qty: yup.string().matches(orderValidation, 'Accept only positive number').nullable()
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
                regular_price: 0,
                offer_price: 0,
                offer_date_from: null,
                offer_date_to: null,
                seller_price: 0,
                minimum_qty: '',
                delivery_locations: null,
                product_availability_from: null,
                product_availability_to: null,
                fixed_delivery_price: 0,
                commission: 0

            }
        });





    const getProduct = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/product/show/${idd}`)
            setProductList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
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

    const multipleImageUploder = async (image: any) => {
        setMultipleImage(image)
        setError('image', { message: '' })
    }


    console.log({ errors })




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
        setError('franchisee', { message: '' })
        setFranchiseSelect(e.target.value)
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)
            const recomendedProduct = await fetchData(`admin/product/recommended/${process.env.NEXT_PUBLIC_TYPE}/${e.target.value}`)
            setVendorList(response?.data?.data)
            let result = recomendedProduct?.data?.data.map((res: any) => ({
                _id: res?._id,
                title: `${res?.name}-${res?.product_id}`,
                product_id: res?.product_id,
                store: res?.store?.name
            }))
            setRecomendedProductList(result)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)

        }


    }

    const onSelectStore = (e: React.ChangeEvent<HTMLInputElement>) => {
        setvendorSelect(e.target.value)
        let result = vendorList?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                commision: get?.additional_details ? get?.additional_details.commission : 0,
                id: get?._id,
                name: get?.store_name,
                category: get?.category_id
            }

        ))

        setCategoryList(result?.[0]?.category)


        let findresult = vendorList?.filter((res: any) => res?._id === e.target.value)
        setVendorListDirection(findresult)
        setValue('commission', result[0]?.commision)
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
        // if(attributes?.length  < 2){
        setAttributes([...attributes, { name: '', options: [], variant: false }])
        // }
    }





    const onChangeAttributes = (e: React.ChangeEvent<HTMLInputElement>, i: number, key: string) => {

        //if (!res && !view) {
        console.log({ attributes })
        attributes[i][key] = e;
        if (key === "options") {
            let result = attributes[i].variant === true;
            if (result) {
                onOptionsChangeaddvarients()
            } else {
                return false;
            }

        }

        //}

    }


    const onCheckShipping = (e: boolean) => {
        if (!view) {
            setValue('require_shipping', e)
            setRequireShipping(e)
        }

    }


    const onChangeProductFrom = (e: any) => {
        setValue('product_availability_from', e)

    }

    const onChangeProductTo = (e: any) => {
        setValue('product_availability_to', e)

    }


    const onCheckPandasuggestion = (e: any) => {
        if (!view) {
            setPandaSuggesions(e)
            setValue('panda_suggession', e)
        }

    }

    const onChangeOffer_date_from = (e: any) => {
        setValue('offer_date_from', e)
    }

    const onChangeOffer_date_to = (e: any) => {
        setValue('offer_date_to', e)

    }





    useEffect(() => {
        if (productList) {
            const getvendorlist = async () => {
                try {
                    const response = await fetchData(`admin/vendor-list/${productList?.franchisee?._id}/${process.env.NEXT_PUBLIC_TYPE}`)
                    const recomendedProduct = await fetchData(`admin/product/recommended/${process.env.NEXT_PUBLIC_TYPE}/${productList?.franchisee?._id}`)
                    let result = recomendedProduct?.data?.data.map((res: any) => ({
                        _id: res?._id,
                        title: `${res?.name}-${res?.product_id}`,
                        product_id: res?.product_id,
                        store: res?.store?.name
                    }))
                    setRecomendedProductList(result)
                    setVendorList(response?.data?.data)
                    setCategoryList(response?.data?.data?.[0]?.category_id)
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
            getvendorlist()
            setRecomendedProductEditList(productList?.related_products)
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
            setCategorySelect(productList?.category?._id)
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
            setValue('product_availability_from', moment(productList?.product_availability_from,))
            setValue('product_availability_to', moment(productList?.product_availability_to, 'HH:mm'))
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
                        variant: item?.variant

                    })

                    setAttributes([...attributesArray])
                })
            }

            let myvaarientArray: { title: any; variant_id: string; attributs: any; seller_price: any; regular_price: string; offer_price: string; offer_date_from: any; offer_date_to: any; stock: boolean; stock_value: string; commission: number; fixed_delivery_price: number; }[] = []
            if (productList?.variants?.length > 0) {
                productList?.variants?.map((item: any) => {
                    myvaarientArray.push({
                        variant_id: item._id,
                        title: item?.title,
                        attributs: item?.attributs,
                        seller_price: item?.seller_price,
                        regular_price: item?.regular_price,
                        offer_price: item?.offer_price,
                        offer_date_from: moment(item?.offer_date_from, 'YYYY-MM-DD'),
                        offer_date_to: moment(item?.offer_date_to, 'YYYY-MM-DD'),
                        stock: item?.stock,
                        stock_value: item?.stock_value,
                        commission: item?.commission,
                        fixed_delivery_price: item?.fixed_delivery_price

                    })
                    setVarientsArray(myvaarientArray)
                })
            }
            setValue('commission', productList?.commision)
            setValue('regular_price', productList?.regular_price)
            setValue('seller_price', productList?.seller_price)
            setValue('offer_price', productList?.offer_price)
            setValue('offer_date_from', moment(productList?.offer_date_from, 'YYYY-MM-DD'))
            setValue('offer_date_to', moment(productList?.offer_date_to, 'YYYY-MM-DD'))
            setValue('fixed_delivery_price', productList?.fixed_delivery_price)

        }

    }, [productList])


    useEffect(() => {
        getFranchiseList()
        // fetchCategoryList()
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
            addvarients()
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
            setValue('regular_price', '')
            setValue('offer_date_to', '')
            setValue('fixed_delivery_price', '')
            // Filter attributes array to only include those with variant true
            const variantAttributes = attributes?.filter((attr: any) => attr.variant !== false)

            let attributesArray = variantAttributes?.map((vari: any) => vari?.options)



            let combines = combine(attributesArray);

            console.log({ combines, varientsarray })

            let attri = combines.map((val: any) => {
                return {
                    title: val,
                    attributs: val.split(' '),
                    seller_price: '',
                    regular_price: '',
                    offer_price: '',
                    offer_date_from: '',
                    offer_date_to: '',
                    stock: stock,
                    stock_value: '',
                    commission: 0,
                    fixed_delivery_price: 0
                }
            })

            console.log({ varientsarray, attri })


            let varia = varientsarray?.filter((obj: any) => {
                return attri.some((obj1: any) => obj.title === obj1.title)
            })

            const result = attri?.filter((obj: any) => {
                return !varientsarray.some((obj1: any) => obj.title === obj1.title)
            })

            //filter results


            setVarientsArray([...varia, ...result])
            console.log({ varientsarray })

        } else {
            setVarientsArray([])
            setVarients([])
        }
    }





    const addvarients = () => {

        console.log({ attributes })

        if (attributes?.some((res: any) => res?.variant === true)) {
            const output = [];
            setValue('seller_price', '')
            setValue('offer_price', '')
            setValue('offer_date_from', '')
            setValue('regular_price', '')
            setValue('offer_date_to', '')
            setValue('fixed_delivery_price', '')
            // Filter attributes array to only include those with variant true
            const variantAttributes = attributes?.filter((attr: any) => attr.variant !== false)

            let attributesArray = variantAttributes?.map((vari: any) => vari?.options)



            let combines = combine(attributesArray);

            let attri = combines.map((val: any) => {
                return {
                    title: val,
                    attributs: val.split(' '),
                    seller_price: '',
                    regular_price: '',
                    offer_price: '',
                    offer_date_from: '',
                    offer_date_to: '',
                    stock: stock,
                    stock_value: '',
                    commission: getValues('commission'),
                    fixed_delivery_price: 0
                }
            })
            setVarientsArray([...attri])
        } else {
            setVarientsArray([])
            setVarients([])
        }
    }



    useEffect(() => {
        addvarients()
    }, [index])





    //remove multiple image function only for edit.........................................................

    const removeImage = (name: string) => {
        const result = defaultImage?.filter((res: any) => res !== name)
        setdefaultImage([...result])

    }

    const changeAttributeValues = (i: number, key: string, values: any) => {
        varientsarray[i][key] = values
        setVarientsArray([...varientsarray])

    }

    //metatag value..........................................................................................

    const metaTagvalues = (res: any) => {
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



        //Check All Attributes have values
        let attributeCheck = attributes?.find((att: any) => isEmpty(att?.name) || att?.options?.length === 0);
        console.log({ attributeCheck, attributes })
        if (attributeCheck) {
            toast.warning("All Attributes must have values")
            return false;
        }

        //Check Any Variants
        let variantsChe = attributes?.find((att: any) => att.variant === true);
        console.log({ length: attributes.length, price: isEmpty(data?.seller_price) })
        if (!variantsChe) {
            if (isNaN(data?.seller_price) || data?.seller_price <= 0) {
                setError("seller_price", { type: 'custom', message: 'Purchase price must be greater than 0' })
                return false;
            }
            if (!isEmpty(data?.offer_price)) {
                if (isNaN(data?.offer_price)) {
                    setError("offer_price", { type: 'custom', message: 'Offer price must be a number' })
                    return false;
                }
                else if (data?.offer_price <= 0) {
                    setError("offer_price", { type: 'custom', message: 'Offer price must be a greater than 0' })
                    return false;
                } else if (!data?.offer_date_from || !data?.offer_date_to) {
                    toast.warning("Offer From date and to date required")
                    return false;

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
            let varicheck = varientsarray?.find((vari: any) => isEmpty(vari?.seller_price) || isNaN(vari?.seller_price) || (isNumber(vari?.seller_price) && vari?.seller_price >= 0))
            if (varicheck) {
                console.log({ varicheck, varientsarray })
                toast.warning("All variants mush have price. Please update price and continue")
                return false;
            }
            else {
                let offer = varientsarray?.filter((vari: any) => !isEmpty(vari?.offer_price))
                if (offer) {
                    let offerpr = offer?.find((off: any) => !off.offer_date_from || !off?.offer_date_to);
                    if (offerpr) {
                        toast.warning("Offer From date and to date required")
                        return false;
                    }
                }

                if (stock) {
                    let stockValue = varientsarray?.find((vari: any) => isEmpty(vari?.stock_value) || isNaN(vari?.stock_value) || (isNumber(vari?.stock_value) && parseInt(vari?.stock_value) <= 0))
                    if (stockValue) {
                        toast.warning("Stock value required for all variants")
                        return false;
                    }
                }

                let delivery = varientsarray?.find((vari: any) => isNaN(vari?.fixed_delivery_price) || vari?.fixed_delivery_price < 0 || isEmpty(vari?.fixed_delivery_price))
                console.log({ delivery })
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
                commision: get?.additional_details ? get?.additional_details.commission : 0,
                id: get?._id,
                name: get?.store_name
            }
        ))



        //below code help to remove duplicates from array.............................

        let recomendedProductList: any = []

        const recomendedProduct = recomendedProductArray?.filter((obj: any) => {
            return !recomendedProductEditList.some((obj1: any) => obj._id === obj1._id)
        })

        recomendedProductList.push(...recomendedProduct)
        recomendedProductList.push(...recomendedProductEditList)


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
            type: process.env.NEXT_PUBLIC_TYPE,
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
            related_products: recomendedProductList,
            attributess: attributes,
            regular_price: data?.regular_price,
            seller_price: data?.seller_price,
            offer_price: data?.offer_price,
            commission: data?.commission,
            fixed_delivery_price: data?.fixed_delivery_price,
            offer_date_from: data?.offer_date_from ? moment(data?.offer_date_from, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            offer_date_to: data?.offer_date_to ? moment(data?.offer_date_to, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            variant: varientsarray?.length > 0 ? true : false,
            variants: varientsarray,
            approval_status: "approved"
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

    const removeAttributes = async (i: any) => {
        attributes[i].variant = false;
        setAttributes([...attributes])
        let attribute = await attributes?.filter((att: any, index: Number) => index !== i)

        console.log({ attribute })
        setAttributes([...attribute])
        addvarients()

    }

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
                                fieldLabel={'Product Availibility'} />
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
                    {productList ? <Polygon onComplete={onPolygonComplete} path={paths} /> :
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

                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.video_link}
                            fieldName="video_link"
                            placeholder={``}
                            fieldLabel={"Product Video Link"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>

                        {/* this only in edit image code ************************************** */}

                        {defaultImage.length > 0 && !view &&
                            <>
                                <Box display={'flex'} gap={2} >
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
                                >{'Additional Images'}

                                </Typography>
                                <Box display={'flex'} gap={2} >

                                    {defaultImage && defaultImage?.map((res: any, i: number) => (
                                        <Box>
                                            <Avatar variant="square" src={`${IMAGE_URL}${res}`} sx={{ width: 130, height: 130, }} />
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        }

                        {!view && <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />}
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
                    <Attributes item={res} index={i} onChange={onChangeAttributes} enableVariant={enableVariant} removeAttributes={!productList ? () => removeAttributes(i) : null} />
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
                            type='text'
                            control={control}
                            error={errors.commission}
                            fieldName="commission"
                            placeholder={''}
                            fieldLabel={"Commission(%)"}
                            view={getValues('regular_price') ? true : false}
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
                            fieldLabel={"Fixed Delivery Price"}
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
                            values={getValues('offer_date_from')}
                            changeValue={onChangeOffer_date_from}
                            fieldName='offer_date_from'
                            control={control}
                            error={errors.offer_date_from}
                            fieldLabel={'Offer From'}
                        />

                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomDatePicker
                            disabled={view ? true : false}
                            values={getValues('offer_date_to')}
                            changeValue={onChangeOffer_date_to}
                            fieldName='offer_date_to'
                            control={control}
                            error={errors.offer_date_to}
                            fieldLabel={'Offer To'}
                        />

                    </Grid>
                </Grid>
            </CustomBox>}
            {varientsarray && varientsarray.length > 0 && <CustomBox title='Add Variant & Price'>
                {varientsarray?.map((varian: any, i: number) => <CustomProductVarient view={view} deafultCommission={getValues('commission')} content={varian} index={i} onChange={(value: any, key: string) => changeAttributeValues(i, key, value)} setState={undefined} state={varientsarray} stock={stock} />)}
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





