import { Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomImageUploader from '@/components/CustomImageUploader';
import CustomAutoComplete from '@/components/CustomAutocompleteBox';
import CustomTimepicker from '@/components/CustomTimepicker';
import { GoogleMap, Polygon, useJsApiLoader, LoadScript, Marker, DrawingManager } from "@react-google-maps/api";
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
    product_availability_from: string,
    product_availability_to: string,
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
    application_type: string
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
    product_availability_from: string,
    product_availability_to: string,
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
    application_type: string
}

const ProductForm = () => {
    const [multipleImage, setMultipleImage] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [stock, setStock] = useState<boolean>(false)
    const [addvarient, setAddVarient] = useState<boolean>(false)
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [attributes, setAttributes] = useState<any>([])
    const [productTag, setProductTag] = useState<any>([])
    const [productTagValue, setProductTagValue] = useState<any>([])
    const [metaTagValue, setmetaTagValue] = useState<any>([])
    const [metaTag, setMetaTag] = useState<any>([])
    const [attributeTag, setattributeTag] = useState<any>([])
    const [attributeTagValue, setattributeTagValue] = useState<any | null>(null)
    const [index, setIndex] = useState<number>(0)
    const [confirmbtn, setConfirmBtn] = useState(false)
    const [varients, setVarients] = useState<any>([])
    const [vendorList, setVendorList] = useState<any>([])
    const [vendorSelect, setvendorSelect] = useState<any>(null);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [categorySelect, setCategorySelect] = useState<any>(null);
    const [subcategorySelect, setSubCategorySelect] = useState<any>(null);
    const [categoryList, setCategoryList] = useState<any>([]);
    const [subcategoryList, setSubCategoryList] = useState<any>([]);
    const [selectType, setSelectType] = useState<any>(null);
    const [pandaSuggesion, setPandaSuggesions] = useState<boolean>(false);
    const [pandType, setPandType] = useState<any>([
        {
            name: 'Qbuy Panda',
            value: 'panda'
        },
        {
            name: 'Qbuy Green',
            value: 'green'
        },
        {
            name: 'Qbuy Fashion',
            value: 'fashion'
        },
    ])
    const [requireShipping, setRequireShipping] = useState<boolean>(false)
    const [varientsarray, setVarientsArray] = useState<any>([])

    const MAX_FILE_SIZE = 102400; //100KB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Product Name Required'),
            display_order: yup.number().nullable().typeError("Must be Integer"),
            franchisee: yup.array().typeError('Franchise is Required').required('Franchise is Required'),
            store: yup.array().typeError('Store is Required').required('Store is Required'),
            type: yup.string().required('Type is Required'),
            category: yup.array().typeError('Category is Required').required('Category is Required'),
            product_image:yup
            .mixed()
            .required("Product Image is Required"),
            meta_tags:yup.array().typeError('Meta Tags is Required').required('Meta Tag is Required')
           
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
                franchisee: '',
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
                // product_availability_from:'',
                // product_availability_to:''

            }
        });

    const onChangeSelectType = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectType(e.target.value)
        setValue('type', e.target.value)
        setError('type', { message: '' })

    }


    const StockCheck = (e: any) => {
        setValue('stock', e)
        setStock(e)
        setValue('stock_value', '')
    }


    const containerStyle = {
        height: '300',
        width: '100%',
    };

    const center = {
        lat: 40.7128,
        lng: -74.006,
    };

    const polygonCoords = [
        { lat: 40.7128, lng: -74.006 },
        { lat: 40.7128, lng: -73.979 },
        { lat: 40.731, lng: -73.979 },
        { lat: 40.731, lng: -74.006 },
    ];

    const options = {
        fillColor: '#000',
        fillOpacity: 0.4,
        strokeColor: '#000',
        strokeOpacity: 1,
        strokeWeight: 1,
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I',
    });


    const [map, setMap] = React.useState<google.maps.Map | null>(null);

    const onLoad = React.useCallback((mapInstance: google.maps.Map) => {
      setMap(mapInstance);
    }, []);
  
    const onUnmount = React.useCallback(() => {
      setMap(null);
    }, []);
  
    const handlePolygonClick = (event: google.maps.MapMouseEvent) => {
      console.log('Polygon clicked:', event);
    };
  

    const imageUploder = async (file: any) => {
        setImagefile(file)
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
    }

    const multipleImageUploder = async (image: any) => {
        setMultipleImage(image)
    }

    const submitImage = async () => {
        const formData = new FormData();
        multipleImage?.map((img: any, i: number) => {
            formData.append(`image[${i}]`, img.file);
        })
        try {
            setLoading(true)
            const response = await postData('admin/product/multipleupload', formData)
            setValue('image', response?.data?.data)
            setError('image', { message: '' })
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }

    }


    const getFranchiseList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/franchise/list')
            setFranchiseList(response?.data?.data?.data)
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }



    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let result = franchiseList?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                id: get?._id,
                name: get?.franchise_name
            }
        ))
        setValue('franchisee', result)
        setError('franchisee', { message: '' })
        setFranchiseSelect(e.target.value)
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor-list/${e.target.value}`)
            setVendorList(response?.data?.data?.data)
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
                id: get?._id,
                name: get?.store_name
            }
        ))
        setValue('store', result)
        setError('store', { message: '' })

    }



    const fetchCategoryList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/category/list')
            setCategoryList(response?.data?.data?.data)
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
        let result = categoryList?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                id: get?._id,
                name: get?.name
            }
        ))
        setValue('category', result)
        setError('category', { message: '' })
        setSubCategoryList([])
        try {
            setLoading(true)
            const response = await fetchData(`admin/subcategory-list/${e.target.value}`)
            setSubCategoryList(response?.data?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const onSelectSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubCategorySelect(e.target.value)
        let result = subcategoryList?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                id: get?._id,
                name: get?.name
            }
        ))
        setValue('sub_category', result)
        setError('sub_category', { message: '' })
    }



    const addAtributes = () => {
        // if(attributes?.length  < 2){
        setAttributes([...attributes, { name: '', options: [], varient: false }])
        // }
    }



    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        console.log(e.target.value)
        attributes[i].name = e.target.value;


    }

    const onChangeOptions = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        setIndex(i)
    }

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
        console.log({ e })
        setValue('offer_date_to', e)

    }


    useEffect(() => {
        getFranchiseList()
        fetchCategoryList()
    }, [])



    useEffect(() => {
        if (attributeTagValue?.length) {
            attributes[index].options = [...attributeTagValue]
        }
    }, [attributeTagValue])


    const AddVarientCheckbox = (e: any, i: number) => {
        let find = attributes?.every((res: any) => res.varient === false)
        setVarientsArray([])
        if (find) {
            setVarients([])

            setConfirmBtn(false)
        }
        setIndex(i)
        setAddVarient(e)
        attributes[i].varient = e;
        setValue('seller_price', '')
        setValue('offer_price', '')
        setValue('offer_date_from', '')
        setValue('regular_price', '')
        setValue('offer_date_to', '')
    }

    const ConfirmVarients = () => {


        setConfirmBtn(true)
        const output = [];
        setVarients([])
        setVarientsArray([])

        // Filter attributes array to only include those with variant true
        const variantAttributes = attributes.filter((attr: any) => attr.varient !== false)
        // Calculate the number of iterations required based on the length of the variantAttributes array
        const numIterations = variantAttributes.reduce((acc: any, curr: any) => acc * curr?.options?.length, 1);
        for (let i = 0; i < numIterations; i++) {
            let combination = "";
            let remainder = i;
            let contentIndex

            varientsarray.push({
                attributs: [],
                seller_price: '',
                regular_price: '',
                offer_price: '',
                offer_date_from: '',
                offer_date_to: '',
                stock: true,
                stock_value: ''
            })
            setVarientsArray([...varientsarray])
            for (let j = variantAttributes.length - 1; j >= 0; j--) {
                contentIndex = remainder % variantAttributes[j].options?.length;
                combination = variantAttributes[j].options[contentIndex].title + " " + combination;
                remainder = Math.floor(remainder / variantAttributes[j].options?.length);

            }

            output.push(combination.trim());
        }
        setVarients(output)

    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {

        const metatagsres = metaTagValue?.map((res: any) => (
            res.title
        ))
        setValue('meta_tags', metatagsres)


        let newData = attributes.map((item: any) => ({
            "name": item.name,
            "options": item.options.map((option: any) => option.title)
        }));


        let value = {
            name: data?.name,
            franchisee: {
                id: data?.franchisee?.[0]?.id,
                name: data?.franchisee?.[0]?.name
            },
            description: data?.description,
            store: {
                id: data?.store?.[0]?.id,
                name: data?.store?.[0]?.name

            },
            weight: data?.weight,
            dimensions: {
                width: data?.width,
                height: data?.height
            },
            model: data?.model,
            type: data?.type,
            product_Type: null,
            image: data?.image,
            product_image: data?.product_image,
            category: {
                id: data?.category?.[0]?.id,
                name: data?.category?.[0]?.name
            },
            sub_category: data?.sub_category ? {
                id: data?.sub_category?.[0]?.id,
                name: data?.sub_category?.[0]?.name
            } : null,
            display_order: data?.display_order,
            panda_suggession: data?.panda_suggession,
            stock: data?.stock,
            stock_value: data?.stock_value,
            minimum_qty: data?.minimum_qty,
            product_availability_from: data?.product_availability_from ? moment(data?.product_availability_from, 'hh:mm A').format('hh:mm') : null,
            product_availability_to: data?.product_availability_to ? moment(data?.product_availability_to, 'hh:mm A').format('hh:mm') : null,
            require_shipping: data?.require_shipping,
            delivery_locations: [
                [
                    8.670514,
                    76.770417
                ],
                [
                    8.770963,
                    77.179658
                ],
                [
                    8.464103,
                    77.333466
                ],
                [
                    8.347269,
                    77.185151
                ],
                [
                    8.311940,
                    77.064301
                ],
                [
                    8.662368,
                    76.775910
                ]
            ],
            coupon_details: null,
            meta_tags: data?.meta_tags,
            video_link: data?.video_link,
            related_products: data?.related_products,
            attributes: newData,
            regular_price: data?.regular_price,
            seller_price: data?.seller_price,
            offer_price: data?.offer_price,
            offer_date_from: data?.offer_date_from ? moment(data?.offer_date_from, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            offer_date_to: data?.offer_date_to ? moment(data?.offer_date_to, 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
            variant: varientsarray?.length > 0 ? true : false,
            variants: varientsarray?.length > 0 ? varientsarray : null,
            approval_status: "approved"
        }
        console.log({ value })

        try {
            setLoading(true)
            await postData('admin/product/create', value)
            reset()
            setFranchiseSelect(null)
            setCategorySelect(null)
            setSelectType(null)
            setImagefile(null)
            setSubCategorySelect(null)
            setvendorSelect(null)
            setConfirmBtn(false)
            setVarientsArray([])
            setmetaTagValue([])
            setMetaTag([])
            setattributeTag([])
            setAttributes([])
            toast.success('Created Successfully')
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }
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
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.type}
                            fieldName="type"
                            placeholder={``}
                            fieldLabel={"Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={selectType}
                            options={''}
                            onChangeValue={onChangeSelectType}
                            background={'#fff'}
                        >
                            {pandType && pandType?.map((res: any) => (
                                <MenuItem value={res?.value}>{res?.name}</MenuItem>
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
                    </Grid> }
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
                    <Grid item xs={12} lg={3}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={pandaSuggesion} label='' onChange={onCheckPandasuggestion} title='Panda Suggestion' />
                    </Grid>
                    <Grid item xs={12} lg={3}>
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
                    {isLoaded &&
                    <Box py={1}>
                       
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={13}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                        >
                            <Polygon paths={polygonCoords} options={options} onClick={handlePolygonClick} />
                        </GoogleMap>
                      
                    </Box> }
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
                        <CustomAutoComplete fieldLabel='Meta Tag' list={metaTag} setValues={setmetaTagValue} onChnageValues={() => null} />
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
                        <CustomMultipleImageUploader state={multipleImage} onChangeImage={multipleImageUploder} fieldLabel='Add Additional Images' />
                        {multipleImage?.length > 0 &&
                            <Box py={1}>
                                <Custombutton btncolor='' disabled={loading} height={40} endIcon={false} startIcon={false} label={'Submit'} onClick={submitImage} IconEnd={''} IconStart={''} />
                            </Box>}

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
                <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={addAtributes} IconEnd={''} IconStart={AddIcon} />


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
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <CustomAutoComplete fieldLabel='Attribute Options' list={attributeTag} setValues={setattributeTagValue} onChnageValues={(e: any) => onChangeOptions(e, i)} />

                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <Typography mb={3}></Typography>
                            <CustomCheckBox isChecked={attributes[i].varient} label='' onChange={(e: any) => AddVarientCheckbox(e, i)} title='Add Variant' />
                        </Grid>
                    </Grid>
                </>
                ))}
                {attributes?.length > 0 &&
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <Custombutton btncolor='' height={40} endIcon={false} startIcon={false} label={'confirm'} onClick={ConfirmVarients} IconEnd={''} IconStart={''} />
                    </Box>}
            </CustomBox>
            {confirmbtn &&
                <CustomBox title='Add Variant & Price'>
                    {attributes?.every((res: any) => res.varient === false) && confirmbtn &&
                        <Grid container spacing={2}>
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.seller_price}
                                    fieldName="seller_price"
                                    placeholder={``}
                                    fieldLabel={"Selling Price"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item lg={2} xs={12}>
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
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.regular_price}
                                    fieldName="regular_price"
                                    placeholder={``}
                                    fieldLabel={"Purchase Price"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>

                            <Grid item lg={2} xs={12}>
                                <CustomDatePicker
                                    values={getValues('offer_date_from')}
                                    changeValue={onChangeOffer_date_from}
                                    fieldName='offer_date_from'
                                    control={control}
                                    error={errors.offer_date_from}
                                    fieldLabel={'Offer From'}
                                />

                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <CustomDatePicker
                                    values={getValues('offer_date_to')}
                                    changeValue={onChangeOffer_date_to}
                                    fieldName='offer_date_to'
                                    control={control}
                                    error={errors.offer_date_to}
                                    fieldLabel={'Offer To'}
                                />

                            </Grid>

                        </Grid>}
                    {attributes?.some((res: any) => res.varient === true) && confirmbtn &&
                        <Box>
                            {varients?.map((res: any, i: any) => (
                                <CustomProductVarient content={res} index={i} setState={setVarientsArray} state={varientsarray} />
                            ))}
                        </Box>
                    }
                </CustomBox>}
            <Box py={3}>
                <Custombutton disabled={loading} btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Product'} onClick={handleSubmit(onSubmit)} />
            </Box>
        </Box>
    )
}

export default ProductForm





