import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import Customselect from '@/components/Customselect';
import { toast } from 'react-toastify';
import { fetchData, postData } from '@/CustomAxios';
import CustomSingleSearch from '@/components/CustomSingleSearch';
import { getProduct } from '../../../helpers/productHelper/productHelper';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { log } from 'console';
import { isEqual } from 'lodash';
type props = {
    handleClose: any;
    open: boolean;
    allProduct: any;
    setaddProductList: any,
    SetDeliveryCharge?: any,
    order_id: string,
    setStoreList: any
    onApiSuccess: (AddedProduct: string) => void;
    added: any
}
type Inputs = {
    name: string;
    franchisee: any;
    store: any;
    price: any;
    quantity: any;
    total: any;
    seller: string | number;
    stock_value: any
    product_id: any;
};

const AddNewProductModal = ({ handleClose, open, allProduct, setaddProductList, SetDeliveryCharge, order_id, setStoreList, onApiSuccess, added }: props) => {


console.log('ADD NEW PRODUCT SCREEN')

    const [productList, setProductList] = useState<any>([]);
    const [productListRes, setProductListRes] = useState<any>([]);
    const [franchise, setFranchise] = useState<any>([])
    const [vendor, setVendor] = useState<any>([]);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [franchiseSelect, setFranchiseSelect] = useState<string>(" ");
    const [vendorSelect, setVendorSelect] = useState<string>(" ");
    const [loading, setLoading] = useState<boolean>(false);
    const [productData, setProductData] = useState<any>([]);
    const [varientSelect, setVarientSelect] = useState<any>([]);
    const [selectProduct, setSelectProduct] = useState<any>([]);
    const [attributeSelect, setAttributeSelect] = useState<any>([])
    const [vendorDetails, setVendorDetails] = useState<any>(null)
    const [stockvl, setstockvl] = useState<any>(null)
    const [productsel, setproductsel] = useState<any>(null)



    const schema = yup
        .object()
        .shape({

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
                franchisee: null,
                price: null,
                product_id: null,
                quantity: null,
                store: null,
                total: null

            },
        },
        );

    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue("total", "")
        setValue("quantity", "")
        setValue("price", "")
        setFranchiseSelect(e.target.value)
        setValue('franchisee', e.target.value)
        setError('franchisee', { message: '' })
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

    const onSelectStore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue("total", "")
        setValue("quantity", "")
        setValue("price", "")
        setValue("franchisee", "")
        setVendorSelect(e.target.value)
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

            setstockvl(response?.data?.data?.stock_value)
            const Filter = response?.data?.data?.map((res: any) => ({
                label: res?.name,
                id: res?._id
            }))
            setProductListRes(response?.data?.data)
            setProductList(Filter)
        } catch (err: any) {
            toast.error(err)
        }
        setValue('store', e.target.value)
        setError('store', { message: '' })

    }


    const OnChangeProduct = useCallback(async (value: any) => {
        setproductsel(value)
        setValue("total", "")
        setValue("quantity", "")
        setValue("price", "")
        let data = productListRes?.filter((res: any) => res?._id === value?.id);
        let prdctlist: any = await getProduct(data?.[0] || []);
 
        console.log({prdctlist},'ADD NEW PRODUCT CONSOLE')

        setSelectProduct(prdctlist)
        let filter = prdctlist || [].filter((res: any) => res?.id === value?.id);
        if (filter?.variant === false) {
            setValue('price', filter?.price);
            setValue("total", filter?.price)
            setValue("seller", filter?.seller)
            setValue("quantity", 1)
        } else {
            setValue("quantity", 0)
            setVarientSelect([])
            setValue('price', "")
        }
        setProductData(prdctlist)

    }, [productListRes])
    const varientOncheck = async (e: any, i: number) => {


        const { value } = e.target;
        productData.attributes[i].selected = value

        //console.log({value, attributes: productData?.attributes})

        let newArray: any[]
        setVarientSelect((prevArray: any) => {
            newArray = [...prevArray];
            newArray[i] = value;
            return newArray;
        });
        if (productData?.variants) {
            const matchedObjects = productData?.variants?.filter((item: any) => newArray.every((attr) => item.attributs.includes(attr)));
            setAttributeSelect(matchedObjects);
            setValue("quantity", 1)
            setValue("seller", matchedObjects[0]?.seller);
            setValue("total", matchedObjects[0]?.price);
            setValue('price', matchedObjects[0]?.price);
            setValue('stock_value', matchedObjects[0]?.stockValue + matchedObjects[0]?.minQty);
        }
        else {
            setValue("total", "")
            setValue("quantity", "")
            setValue("price", "")
            let data = productListRes?.filter((res: any) => res?._id === productsel?.id);
            let prdctlist: any = await getProduct(data?.[0] || []);


            setSelectProduct(prdctlist)
            let filter = prdctlist || [].filter((res: any) => res?.id === value?.id);
            if (filter?.variant === false) {
                setValue('price', filter?.price);
                setValue("total", filter?.price)
                setValue("seller", filter?.seller)
                setValue("quantity", 1)
            } else {
                setValue("quantity", 0)
                setVarientSelect([])
                setValue('price', "")
            }
            setProductData(prdctlist)

        }

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


    const OnChangeQuantity = (e: any) => {
        const { value } = e.target;
        setValue("quantity", value)
        if (value === "" || value <= 0) {
            setError('quantity', { message: 'Quantity is Required' })
            return false;
        }
        else {
            setError('quantity', { message: "" })
        }


        let stock = selectProduct?.stock;

        if (selectProduct?.available) {
            if (selectProduct?.variant === false) {

                let minQty = selectProduct?.minQty
                let stockValue = selectProduct?.stockValue;
                if (stock) {
                    if (parseFloat(value) > stockValue) {
                        toast.error("Stock Value excedded")
                    } else {
                        let total = parseFloat(value) * selectProduct?.price;
                        setValue("total", total)
                    }
                } else {
                    let total = 0;
                    total = parseFloat(value) * selectProduct?.price;
                    setValue("total", total)
                }
            } else {
                let stockValue = attributeSelect?.[0]?.stockValue;
                if (stock) {

                    if (parseFloat(value) > stockValue) {
                        toast.error("Stock Value excedded ")
                    } else {

                        let total = (parseFloat(value) * attributeSelect?.[0]?.price);
                        setValue("total", total)
                    }
                } else {

                    let result = (parseInt(attributeSelect?.[0]?.price) * parseFloat(value));
                    setValue("total", result)

                }
            }

        } else {
            toast.warning("Product Not Available")
            setValue("quantity", "")
        }
    }




    const Submit = async (data: any) => {


        //console.log({added, attributes: productData?.attributes})

        //return false;

        let attributes:string[] = [];

        productData?.attributes?.map((attr: any) => {
            if(attr?.selected){
                attributes?.push(attr?.selected)
            }
        })


        if(productData?.attributes && attributes?.length !== productData?.attributes?.length){
            toast.error("Please select all attributes")
            return false
        }

        let quntityValidation = parseInt(data?.quantity)
        let stock = selectProduct?.stock;



        let stk = selectProduct?.stockValue;
        if (stock) {
            if (parseFloat(data?.quantity) > stk) {
                toast.error("Stock Value excedded")
                return false
            }
        }

        let stockValue_attribute = attributeSelect?.[0]?.stockValue;
        if (stock) {

            if (parseFloat(data?.quantity) > stockValue_attribute) {
                toast.error("Stock Value excedded in attributecase")

                return false;

            }
        }
        if (quntityValidation < 1 || Number.isNaN(quntityValidation)) {
            toast.warning('Wrong Data!...')
            return false;
        }


        let AllProducts: any = []
        AllProducts = structuredClone(allProduct);
     
        //console.log({AllProducts, selectProduct})
        if (!selectProduct?.variant) {
            if(attributes?.length > 0){
                let existing = false
                AllProducts?.productDetails?.map((pro: any) => {
                    if(isEqual(pro?.attributes?.sort(), attributes?.sort())){
                        toast.warning('Product already exits');
                        existing = true;
                       return false
                    }
                })

                if(existing){
                    return false;
                }
            }
            else{
            
                let duplicateProduct = AllProducts?.productDetails?.some((res: any) => res?.product_id === selectProduct?._id);
                if (duplicateProduct) {
                    toast.warning('Product already exits');
                    return false;
                }
            }
            

        } else {
            let duplicateVarient = AllProducts?.productDetails?.some((res: any) => res?.variant_id === attributeSelect?.[0]?.id);
            if (duplicateVarient) {
                toast.warning('Product already exits');
                return false;
            }
        }
   


        let value: any = {
            image: selectProduct?.product_image,//
            name: selectProduct?.name,//
            price: data?.total,//
            product_id: selectProduct?._id,
            quantity: data?.quantity,//
            seller_price: data?.seller,
            store_address: vendorDetails?.[0]?.store_address,
            store_name: vendorDetails?.[0]?.store_name,
            type: null,
            vendor: vendorDetails?.[0],
            unitPrice: data?.price,
            variant_id: null,
            vendor_mobile: vendorDetails?.[0]?.vendor_mobile,
            title: null,
            stock_value: null,
            deliveryPrice: selectProduct?.delivery,
            description: selectProduct?.description,
            offer_date_from: selectProduct?.offer_date_from,
            offer_date_to: selectProduct?.offer_date_to,
            offer_price: selectProduct?.offer_price,
            store_commission: selectProduct?.store_commission,
            product_commission: selectProduct.product_commission,

        }
      

        if (selectProduct?.variant === true) {
            
            value['type'] = "variant";
            value['deliveryPrice'] = attributeSelect?.[0]?.delivery;
            // value['fixed_delivery_price']=attributeSelect?.[0]?.delivery;
            value['title'] = attributeSelect?.[0]?.title;
            value['variant_id'] = attributeSelect?.[0]?.id;
            value["attributes"] = attributeSelect?.[0]?.attributs
            value['stock_value'] = selectProduct.stock ? parseInt(attributeSelect?.[0]?.stockValue) + parseInt(attributeSelect?.[0]?.minQty) : null;
        } else {
       

            if(attributes){
                value["attributes"] = attributes
            }
            // value['fixed_delivery_price'] = selectProduct?.delivery;
            value['type'] = "single";
            value['deliveryPrice'] = selectProduct?.delivery;
            value['stock_value'] = selectProduct?.delivery;
        }

        if (AllProducts && AllProducts.productDetails) {

            AllProducts.productDetails.push(value);
        } else {
            AllProducts = AllProducts || {};

            AllProducts.productDetails = [value];
        }        // setaddProductList((previous)=>[previous,value])


        // setVendorStatus(AllProducts.productDetails?.map((res: any) => ({ "vendor_id": null, "status": null})))
        // console.log(AllProducts.productDetails,'ALL PRODUCTS PUSH')

        //find highest delivery Charge
        const highestDelivery = AllProducts.productDetails.reduce((highest: any, delivery: any) => {
            return Math.max(highest, delivery.deliveryPrice);
        }, 0);

    

        SetDeliveryCharge(highestDelivery)
        // AllProducts['delivery_charge'] = allProduct?.delivery_charge;
        AllProducts['delivery_charge'] = highestDelivery;
        AllProducts['total_amount'] = parseInt(data?.total) + parseInt(allProduct?.total_amount);
        AllProducts['grand_total'] = (parseInt(data?.total) + parseInt(allProduct?.total_amount)) + parseInt(highestDelivery) + allProduct?.platform_charge;

        // if (Number.isNaN(AllProducts?.grand_total)) {
        //     toast.warning('product not available');
        //     return false;
        // }




        try {
            setLoading(true)
            let publishValue = {
                id: added ? added?.product_details?._id : null,
                productDetails: [...AllProducts.productDetails]
            }
            //return false;
            const response = await postData('admin/order/createproduct', publishValue);
            const AddedProduct = response?.data?.data;
    

            onApiSuccess(AddedProduct);
            let find = publishValue?.productDetails?.map((res) => (res?.vendor?._id));
            setStoreList(find)

            toast.success('Product Added Successfully')
            setLoading(false)
            setaddProductList(AllProducts);
            handleClose()
            AllProducts = [];
        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
            setLoading(false)
        }

    }



    useEffect(() => {
        getFranchiseList()
    }, [])


    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={'lg'}
            fullWidth
        >
            <Box p={1} >
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box>

                    </Box>
                    <Box>
                        <Typography sx={{
                            fontSize: {
                                lg: 24,
                                md: 20,
                                sm: 16,
                                xs: 11,
                            },
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            fontFamily: `'Poppins' sans-serif`,
                        }}>{'Add New Product'}</Typography>
                    </Box>
                    <Box onClick={handleClose}>
                        <Box
                            width={25}
                            height={25}
                            sx={{
                                backgroundColor: 'black',
                                borderRadius: 5,
                                p: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}>
                            <HighlightOffIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                    </Box>
                </Box>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={3}>
                            <Customselect
                                disabled={false}
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
                                disabled={false}
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
                                {vendor && vendor?.map((res: any) => (
                                    <MenuItem value={res?._id}>{res?.store_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomSingleSearch
                                control={control}
                                error={errors.product_id}
                                fieldName='product_id'
                                list={productList}
                                onChangeValue={OnChangeProduct}
                                fieldLabel='Products'

                            />
                        </Grid>

                        {(productData) && productData?.attributes?.map((res: any, i: number) => (
                            <Grid item xs={12} lg={1.5}>
                                <Customselect
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.franchisee}
                                    fieldName="franchisee"
                                    placeholder={``}
                                    fieldLabel={res?.name}
                                    selectvalue={""}
                                    height={40}
                                    label={''}
                                    size={16}
                                    value={varientSelect[i]}
                                    options={''}
                                    onChangeValue={(e: any) => varientOncheck(e, i)}
                                    background={'#fff'}
                                >
                                    <MenuItem value="" disabled >
                                        <em>select Attributes</em>
                                    </MenuItem>
                                    {res?.options.map((res: any) => (
                                        <MenuItem value={res}>{res}</MenuItem>
                                    ))}
                                </Customselect>
                            </Grid>
                        ))
                        }
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                onChangeValue={OnChangeQuantity}
                                type='text'
                                control={control}
                                error={errors.quantity}
                                fieldName="quantity"
                                placeholder={``}
                                fieldLabel={"Quantity"}
                                disabled={false}
                                view={false}

                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.price}
                                fieldName="price"
                                placeholder={``}
                                fieldLabel={"Price"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.total}
                                fieldName="total"
                                placeholder={``}
                                fieldLabel={"Total"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />
                        </Grid>
                    </Grid>
                    <Box py={1} display={'flex'} justifyContent={'center'}>
                        <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Add'}
                            disabled={loading}
                            onClick={handleSubmit(Submit)} />
                    </Box>

                </DialogContent>
            </Box>

        </Dialog>
    )
}

export default AddNewProductModal