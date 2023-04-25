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
import { set } from 'lodash';
import Polygon from '@/components/maps/Polygon';
import { IMAGE_URL } from '../../Config/index';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TagInput from '@/components/TagInput'
import Attributes from './Attributes'
import { useRouter } from 'next/router';

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

const ProductForm = ({ res }: props) => {

    console.log({ res })

    const router = useRouter()


    const [multipleImage, setMultipleImage] = useState<any>([])

    const [defaultImage, setdefaultImage] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [stock, setStock] = useState<boolean>(false)
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [attributes, setAttributes] = useState<any>([])
    const [metaTagValue, setmetaTagValue] = useState<any>([])
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






    const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Product Name Required'),
            // display_order: yup.number().nullable().typeError("Must be Integer"),
            franchisee: yup.string().typeError('Franchise is Required').required('Franchise is Required'),
            store: yup.string().typeError('Store is Required').required('Store is Required'),
            category: yup.string().typeError('Category is Required').required('Category is Required'),
            // delivery_locations: yup.array().typeError('Delivery location is Required').required('Delivery location is Required'),
            product_image: yup
                .mixed()
                .required("Product Image is Required"),
            // seller_price: attributes.every((res: any) => res?.varients === false) ? yup.string().required('Purchase Price is Required') : yup.string()

            // meta_tags: yup.array().typeError('Meta Tags is Required').required('Meta Tag is Required')

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
                franchisee: res ? res?.franchisee : '',
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

    // const onChangeSelectType = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelectType(e.target.value)
    //     setValue('type', e.target.value)
    //     setError('type', { message: '' })

    // }


    const StockCheck = (e: any) => {
        setValue('stock', e)
        setStock(e)
        setValue('stock_value', '')
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
            setVendorList(response?.data?.data)
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
                name: get?.store_name
            }

        ))

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




    // const onChangeName = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    //     attributes[i].name = e.target.value;


    // }

    const onChangeAttributes = (e: React.ChangeEvent<HTMLInputElement>, i: number, key: string) => {
        if (!res) {
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

    }

    // const onChangeOptions = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    //     setIndex(i)
    // }

    const onCheckShipping = (e: boolean) => {
        setValue('require_shipping', e)
        setRequireShipping(e)

    }


    const onChangeProductFrom = (e: any) => {
        setValue('product_availability_from', e)

    }

    const onChangeProductTo = (e: any) => {
        setValue('product_availability_to', e)

    }


    const onCheckPandasuggestion = (e: any) => {
        setPandaSuggesions(e)
        setValue('panda_suggession', e)
    }

    const onChangeOffer_date_from = (e: any) => {
        setValue('offer_date_from', e)
    }

    const onChangeOffer_date_to = (e: any) => {
        setValue('offer_date_to', e)

    }






    //edit product details..................................................................



    useEffect(() => {
        if (res) {

            console.log({ res }, "in edit")

            const getvendorlist = async () => {
                try {
                    const response = await fetchData(`admin/vendor-list/${res?.franchisee?._id}/${process.env.NEXT_PUBLIC_TYPE}`)

                    setVendorList(response?.data?.data)
                    setValue('franchisee', res?.franchisee?._id)
                } catch (err: any) {
                    toast.error(err?.message)
                }
            }
            const getSubcategory = async () => {
                try {
                    const response = await fetchData(`admin/subcategory-list/${res?.category?._id}`)
                    setSubCategoryList(response?.data?.data)
                } catch (err: any) {
                    toast.error(err?.message)
                }

            }
            getSubcategory()
            getvendorlist()
            setValue('name', res?.name)
            setValue('franchisee', res?.franchisee?._id)
            setFranchiseSelect(res?.franchisee?._id)
            setValue('store', res?.store?._id)
            setvendorSelect(res?.store?._id)
            setValue('description', res?.description)
            setValue('weight', res?.weight)
            setValue('model', res?.model)
            setValue('width', res?.dimensions?.width)
            setValue('height', res?.dimensions?.height)
            setValue('category', res?.category?._id)
            setCategorySelect(res?.category?._id)
            setValue('sub_category', res?.sub_category?._id)
            setSubCategorySelect(res?.sub_category?._id)
            setValue('display_order', res?.display_order)
            setValue('panda_suggession', res?.panda_suggession)
            setPandaSuggesions(res?.panda_suggession)
            setValue('stock', res?.stock)
            setStock(res?.stock)
            setValue('stock_value', res?.stock_value)
            setValue('minimum_qty', res?.minimum_qty)
            setImagePreview(`${IMAGE_URL}${res?.product_image}`)

            let paths = res?.delivery_locations?.map((loc: any) => {
                return {
                    lat: parseFloat(loc[0]),
                    lng: parseFloat(loc[1])
                }
            })
            setPaths(paths)
            setValue('delivery_locations', res?.delivery_locations)
            setValue('product_availability_from', moment(res?.product_availability_from, 'HH:mm'))
            setValue('product_availability_to', moment(res?.product_availability_to, 'HH:mm'))
            setValue('require_shipping', res?.require_shipping)
            setRequireShipping(res?.require_shipping)
            if (res?.meta_tags) {
                setMetaTag(res?.meta_tags?.map((res: any) => ({
                    title: res
                })))
                setmetaTagValue(res?.meta_tags?.map((res: any) => ({
                    title: res
                })))
            }
            setValue('video_link', res?.video_link)
            setValue('related_products', res?.related_products)
            setValue('product_image', res?.product_image)
            if (res?.image) {
                let imageslist = res?.image?.map((res: any) => (
                    res

                ))
                setdefaultImage([...imageslist])
            }


            let attributesArray: { name: any; options: any; variant: boolean; }[] = []
            if (res?.attributes?.length > 0) {
                res?.attributes.map((item: any) => {
                    attributesArray.push({
                        name: item?.name,
                        options: item?.options,
                        variant: item?.variant

                    })

                    setAttributes([...attributesArray])
                })
            }

            let myvaarientArray: { title: any; variant_id: string; attributs: any; seller_price: any; regular_price: string; offer_price: string; offer_date_from: any; offer_date_to: any; stock: boolean; stock_value: string; commission: number; fixed_delivery_price: number; }[] = []
            if (res?.variants?.length > 0) {
                res?.variants?.map((item: any) => {
                    myvaarientArray.push({
                        variant_id: item._id,
                        title: item?.attributs,
                        attributs: item?.attributs,
                        seller_price: item?.regular_price,
                        regular_price: item?.seller_price,
                        offer_price: item?.offer_price,
                        offer_date_from: moment(item?.offer_date_from, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                        offer_date_to: moment(res?.offer_date_to,'YYYY-MM-DD').format('YYYY-MM-DD'),
                        stock: item?.stock,
                        stock_value: item?.stock_value,
                        commission: item?.commission,
                        fixed_delivery_price: item?.fixed_delivery_price

                    })
                    setVarientsArray(myvaarientArray)
                })
            }



            setValue('commission', res?.commision)
            setValue('regular_price', res?.seller_price)
            setValue('seller_price', res?.regular_price)
            setValue('offer_price', res?.offer_price)
            setValue('offer_date_from', moment(res?.offer_date_from, 'YYYY-MM-DD'))
            setValue('offer_date_to', moment(res?.offer_date_to, 'YYYY-MM-DD'))

        }

    }, [res])


    useEffect(() => {
        getFranchiseList()
        fetchCategoryList()
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
        if (!res) {
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
            const variantAttributes = attributes.filter((attr: any) => attr.variant !== false)

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
                    stock: true,
                    stock_value: '',
                    commission: 0,
                    fixed_delivery_price: 0
                }
            })


            const result = attri.filter((obj: any) => {
                return !varientsarray.some((obj1: any) => obj.title === obj1.title)
            })

            setVarientsArray([...varientsarray, ...result])
            console.log({ varientsarray })
            console.log({ attributesArray })
        } else {
            setVarientsArray([])
            setVarients([])
        }
    }





    const addvarients = () => {

        if (attributes?.some((res: any) => res?.variant === true)) {
            const output = [];
            setValue('seller_price', '')
            setValue('offer_price', '')
            setValue('offer_date_from', '')
            setValue('regular_price', '')
            setValue('offer_date_to', '')
            setValue('fixed_delivery_price', '')
            // Filter attributes array to only include those with variant true
            const variantAttributes = attributes.filter((attr: any) => attr.variant !== false)

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
                    stock: true,
                    stock_value: '',
                    commission: 0,
                    fixed_delivery_price: 0
                }
            })






            setVarientsArray([...attri])

            //console.log()
            // Calculate the number of iterations required based on the length of the variantAttributes array
            // const numIterations = variantAttributes.reduce((acc: any, curr: any) => acc * curr?.options?.length, 1);
            // for (let i = 0; i < numIterations; i++) {
            //     let combination = "";
            //     let remainder = i;
            //     let contentIndex;
            //     let vari = [];
            //     for (let j = variantAttributes.length - 1; j >= 0; j--) {
            //         contentIndex = remainder % variantAttributes[j].options?.length;
            //         combination = variantAttributes[j].options[contentIndex].title + " " + combination;
            //         vari.push(variantAttributes[j].options[contentIndex].title)
            //         remainder = Math.floor(remainder / variantAttributes[j].options?.length);
            //     }
            //     varientsarray.push({
            //         attributs: '',
            //         seller_price: '',
            //         regular_price: '',
            //         offer_price: '',
            //         offer_date_from: '',
            //         offer_date_to: '',
            //         stock: true,
            //         stock_value: '',
            //         commission: 0,
            //         fixed_delivery_price: 0
            //     })
            //     setVarientsArray([...varientsarray])
            //     output.push(combination.trim());
            // }
            // setVarients(output)

            // console.log({output})

        } else {
            setVarientsArray([])
            setVarients([])
        }
    }



    useEffect(() => {
        addvarients()
    }, [index])


    const [path, setPath] = useState([
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
    ]);

    // Define refs for Polygon instance and listeners
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

    // Call setPath with new edited path
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng: google.maps.LatLng) => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
        }
    }, [setPath]);

    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
        (polygon: google.maps.Polygon) => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );

    // Clean up refs
    const onUnmount = useCallback(() => {
        listenersRef.current.forEach((lis: google.maps.MapsEventListener) => lis.remove());
        polygonRef.current = null;
    }, []);


    //remove multiple image function only for edit.........................................................

    const removeImage = (name: string) => {
        const result = defaultImage?.filter((res: any) => res !== name)
        setdefaultImage([...result])

    }

    //posting products ...................................................................................................

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {



        let franchiseData = franchiseList?.filter((res: any) => res?._id === franchiseSelect).map((get: any) => (
            {
                id: get?._id,
                name: get?.franchise_name
            }
        ))



        let categoryData = categoryList?.filter((res: any) => res?._id === categorySelect).map((get: any) => (
            {
                id: get?._id,
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



        const metatagsres = metaTagValue?.map((res: any) => (
            res.title
        ))
        setValue('meta_tags', metatagsres)



        let newData = attributes.map((item: any) => ({
            "name": item.name,
            "options": item.options.map((option: any) => option.title),
            "variant": item.varient
        }));

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
            product_Type: null,
            image: imagearray?.length > 0 ? imagearray : defaultImage,
            product_image: data?.product_image,
            category: {
                _id: categoryData?.[0]?.id,
                name: categoryData?.[0]?.name,
                image: categoryData?.[0]?.image
            },
            sub_category: data?.sub_category ? {
                _id: subCategoryData?.[0]?.id,
                name: subCategoryData?.[0]?.name
            } : null,
            display_order: data?.display_order,
            panda_suggession: data?.panda_suggession,
            stock: data?.stock,
            stock_value: data?.stock_value,
            minimum_qty: data?.minimum_qty,
            product_availability_from: data?.product_availability_from ? moment(data?.product_availability_from, 'hh:mm A').format('hh:mm') : null,
            product_availability_to: data?.product_availability_to ? moment(data?.product_availability_to, 'hh:mm A').format('hh:mm') : null,
            require_shipping: data?.require_shipping,
            delivery_locations: data?.delivery_locations ? data?.delivery_locations : vendorlistDirection?.[0]?.delivery_location,
            coupon_details: null,
            meta_tags: metatagsres,
            video_link: data?.video_link,
            related_products: data?.related_products,
            attributess: attributes,
            regular_price: data?.seller_price,
            seller_price: data?.regular_price,
            offer_price: data?.offer_price,
            commission: data?.regular_price ? 0 : data?.commission,
            fixed_delivery_price: data?.fixed_delivery_price,
            offer_date_from: data?.offer_date_from ? moment(data?.offer_date_from,'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            offer_date_to: data?.offer_date_to ? moment(data?.offer_date_to, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            variant: varientsarray?.length > 0 ? true : false,
            variants: varientsarray,
            approval_status: "approved"
        }
        if (res) {
            value["id"] = res?._id;
        }
            try {
                setLoading(true)
                await postData(res ? EDIT_URL : CREATE_URL, value)
                reset()
                setFranchiseSelect(null)
                setCategorySelect(null)
                //setSelectType(null)
                setImagefile(null)
                setSubCategorySelect(null)
                setvendorSelect(null)
                //setConfirmBtn(false)
                setVarientsArray([])
                setmetaTagValue([])
                setMetaTag([])
                setattributeTag([])
                setAttributes([])
                setRequireShipping(false)
                setMultipleImage([])
                toast.success(res ? 'Updated Successfully' : 'Created Successfully')
                if (res) {
                    router?.push('/products')
                }
            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)

            } finally {

                setLoading(false)
            }
    }




    const changeAttributeValues = (i: number, key: string, values: any) => {
        varientsarray[i][key] = values
        setVarientsArray([...varientsarray])

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
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Customselect
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
                            {franchiseList && franchiseList?.map((res: any) => (
                                <MenuItem value={res?._id}>{res?.franchise_name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={getValues('franchisee') ? false : true}
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
                            view={false}
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
                            view={false}
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
                            view={false}
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
                            view={false}
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
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
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
                        >
                            {categoryList && categoryList?.map((res: any) => (
                                <MenuItem value={res?._id}>{res?.name}</MenuItem>
                            ))}

                        </Customselect>
                    </Grid>

                    {subcategoryList?.length > 0 && <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={getValues('category') ? false : true}
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
                            view={false}
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
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.stock_value}
                                fieldName="stock_value"
                                placeholder={``}
                                fieldLabel={"Stock"}
                                disabled={false}
                                view={false}
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
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={3}>
                        <CustomAutoComplete fieldLabel='Product Tag' list={productTag} setValues={setProductTagValue} onChnageValues={() => null} />
                    </Grid> */}
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

                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Delivery Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.8}>
                        <CustomTimepicker
                            changeValue={onChangeProductFrom}
                            fieldName='product_availability_from'
                            control={control}
                            error={errors.product_availability_from}
                            fieldLabel={'Product Availibility'} />
                    </Grid>
                    <Grid item xs={12} lg={1.8}>
                        <Typography mb={3}></Typography>
                        <CustomTimepicker
                            changeValue={onChangeProductTo}
                            fieldName='product_availability_to'
                            control={control}
                            error={errors.product_availability_to}
                            fieldLabel={''} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={requireShipping} label='' onChange={onCheckShipping} title='Requires Shipping' />
                    </Grid>
                </Grid>
                <Box py={2}>
                    <Divider />
                    {res ? <Polygon onComplete={onPolygonComplete} path={paths} /> :
                        <Maps onPolygonComplete={onPolygonComplete} />}
                    {(errors && errors?.delivery_locations) && <span style={{ color: 'red', fontSize: 12 }}>{`${errors?.delivery_locations?.message}`}</span>}
                </Box>
            </CustomBox>
            {/* <CustomBox title='offers & Promotions'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Product offer"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Offer Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Coupon Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.subcategory}
                            fieldName="subcategory"
                            placeholder={``}
                            fieldLabel={"Coupon Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={'subcategory'}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Coupon Value"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Coupon Code"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox> */}
            <CustomBox title='Additional Options'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <CustomAutoComplete res={res} fieldLabel='Meta Tag' list={metaTag} setValues={setmetaTagValue} onChnageValues={() => null} />
                    </Grid>

                    {/* <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Tax Class"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid> */}
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.video_link}
                            fieldName="video_link"
                            placeholder={``}
                            fieldLabel={"Product Video Link"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>

                        {/* this only in edit image code ************************************** */}

                        {defaultImage.length > 0 &&
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

                        {/* this only in edit image code ************************************** */}
                        <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.related_products}
                            fieldName="related_products"
                            placeholder={``}
                            fieldLabel={"Related Products"}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Attributes'>

                {!res &&
                    <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={addAtributes} IconEnd={''} IconStart={AddIcon} />}
                {attributes && attributes?.map((res: any, i: any) =>
                    <Attributes item={res} index={i} onChange={onChangeAttributes} enableVariant={enableVariant} />
                )}

                {/* {!attributes?.some((res: any) => res.varient === true) && <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={addAtributes} IconEnd={''} IconStart={AddIcon} />}


                {attributes && attributes?.map((res: any, i: any) => (<>
                    <Grid container spacing={2} py={1}>
                        <Grid item xs={12} lg={2}>
                            <CustomInput
                                onChangeValue={(e: any) => onChangeName(e, i)}
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.attributess}
                                fieldName="attributess"
                                placeholder={``}
                                fieldLabel={"Name"}
                                view={false}
                                defaultValue={res.name}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            
                            <CustomAutoComplete fieldLabel='Attribute Options' vres={res?.options} list={attributeTag} setValues={setattributeTagValue} onChnageValues={(e: any) => onChangeOptions(e, i)} />

                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <Typography mb={3}></Typography>
                            <CustomCheckBox isChecked={attributes[i].varient} label='' onChange={(e: any) => AddVarientCheckbox(e, i)} title='Add Variant' />
                        </Grid>
                    </Grid>
                </>
                ))} */}
                {/* {attributes?.length > 0 &&
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        {!confirmbtn && <Custombutton btncolor='' height={40} endIcon={false} startIcon={false} label={'confirm'} onClick={ConfirmVarients} IconEnd={''} IconStart={''} />}
                    </Box>} */}
            </CustomBox>
            {attributes?.every((res: any) => res.varient === false) && <CustomBox title='Price'>
                <Grid container spacing={2}>
                    <Grid item lg={1.71} xs={12}>
                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.seller_price}
                            fieldName=" seller_price"
                            placeholder={``}
                            fieldLabel={"Purchase Price"}
                            view={false}
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
                            view={false}
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
                            type='number'
                            control={control}
                            error={errors.fixed_delivery_price}
                            fieldName=" fixed_delivery_price"
                            placeholder={``}
                            fieldLabel={"Fixed Delivery Price"}
                            view={false}
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
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={1.71} xs={12}>
                        <CustomDatePicker
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
            {varientsarray && <CustomBox title='Add Variant & Price'>
                {varientsarray?.map((varian: any, i: number) => <CustomProductVarient deafultCommission={getValues('commission')} content={varian} index={i} onChange={(value: any, key: string) => changeAttributeValues(i, key, value)} setState={undefined} state={varientsarray} />)}
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
            </Box>
        </Box>
    )
}

export default ProductForm





