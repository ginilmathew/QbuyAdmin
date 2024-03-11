import { Box, DialogContent, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import { toast } from 'react-toastify';
import { postData } from '@/CustomAxios';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';


type props = {
    handleClose: any;
    open: boolean;
    data: any;
    mode: string | null;
    allProduct: any;
    order_iD: string;
    setProductList: any,
    SetDeliveryCharge?: any
    setproductDetailsChangeStatus: any,
    setProductDatas: any
}
type Inputs = {
    name: string,
    quantity: string,
    total: number,
    seller_price: any,
    unitPrice?: any,
    deliveryPrice?: any,
    product_id: string,
    image?: string,
    type: any,
    variant_id?: any,
    store_address?: string,
    store_name?: string,
    vendor_mobile?: string,
    delivery?: any,
    attributes?: any,
    offer_date_from?: any,
    offer_date_to?: any,
    offer_price?: any,
    store_commission?: any,
    product_commission?: any,
    vendor?: any,
    variants?: any,
    //setProductDatas: any






};

const ProductDetailEditModal = ({ handleClose, open, data, mode, allProduct, order_iD, setProductList, SetDeliveryCharge, setproductDetailsChangeStatus, setProductDatas }: props) => {


    const { query } = useRouter()


    useEffect(() => {

        async function getProductsPriceWithoutOffers() {
            if(mode === "product"){
                let datas = {
                    type: process.env.NEXT_PUBLIC_TYPE,
                    productDetails:{
                        product_id: data?.product_id,
                        type: data?.type,
                        variants: data?.type === "variant" ? data?.variants : [],
                        quantity: data?.quantity
                    }
                
                }
    
                const response = await postData('admin/order/get-product-normal-price', datas);

                let formDatas = {
                    name: `${data?.name} ${data?.attributes ? '(' + data?.attributes.join(', ') + ')' : ''}`,
                    seller_price: response?.data?.data?.seller_price,
                    quantity: response?.data?.data?.quantity,
                    unitPrice: response?.data?.data?.regular_price,
                    total: parseFloat(response?.data?.data?.regular_price) * parseFloat(response?.data?.data?.quantity),
                    product_id: response?.data?.data?.product_id,
                    variant_id: response?.data?.data?.variant_id,
                    type: response?.data?.data?.type,
                    id:  order_iD,
                    variants: response?.data?.data?.variants,
                    product_tax: response?.data?.data?.product_tax
                }
                reset(formDatas)
            }
            else{

                let formDatas = {
                    deliveryPrice: data?.delivery_charge
                }
                reset(formDatas)
            }

            
            //setProductDatas(response.data.data)
        }

        getProductsPriceWithoutOffers()
      
    }, [data, mode])
    



    const schema = yup
        .object()
        .shape({
            quantity: yup
                .string()
                .typeError('Quantity is Required')
                .required('Quantity is Required')
                .test('is-min-value', 'Quantity must be at least 1', (value) => {
                    // Add your validation logic here
                    return parseInt(value) >= 1; // Validate if quantity is greater than or equal to 1
                }),
            // seller_price: yup.string().required('Required')
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
            // defaultValues: mode === 'product' ? {
            //     product_id: data?.product_id,
            //     name: `${data?.name} ${data?.attributes ? `(${data?.attributes?.join(', ')})` : ""}`,
            //     quantity: data?.quantity || "",
            //     total: (data?.quantity * data?.price),
            //     seller_price: data?.seller_price,
            //     unitPrice: data?.unitPrice,
            //     //deliveryPrice: allProduct?.delivery_charge,
            //     image: data?.image,
            //     type: data?.type,
            //     variant_id: data?.variant_id,
            //     store_address: data?.store_address,
            //     store_name: data?.store_name,
            //     vendor_mobile: data?.vendor_mobile ? data?.vendor_mobile : null,
            //     //delivery: data?.delivery,
            //     attributes: data?.attributes,
            //     //offer_date_from: data?.offer_date_from,
            //     //offer_date_to: data?.offer_date_to,
            //     //offer_price: data?.offer_price,
            //     //store_commission: data?.store_commission,
            //     //product_commission: data.product_commission,
            //     //vendor: data?.vendor,
            //     //variants: data?.variants
            // } : {
            //     delivery: data?.delivery_charge,
            //     deliveryPrice: data?.delivery_charge,
            // }

        });

    const [outOfStock, setOutOfStock] = useState(false);

    const onChangePurchaseValue = (e: any) => {
        const { value } = e.target;
        setValue('seller_price', value)
        let unitPrice = getValues('unitPrice')
        if (parseInt(unitPrice) < parseInt(value) || value === "") {
            // setValue("seller_price", "")
            setError('seller_price', { message: 'Should be less than purchase Rate' })
        } else {
            setError('seller_price', { message: '' })
        }
    }




    const onChangeRegularValue = (e: any) => {
        const { value } = e.target;
        setValue('unitPrice', value)

        let sellerPrice = getValues('seller_price');
        let quantity = getValues('quantity');
        if (parseInt(sellerPrice) > parseInt(value) || value === "") {
            // setValue("unitPrice", "")
            setError('unitPrice', { message: 'Should be more than purchase Rate' })
        } else {
            setError('unitPrice', { message: '' })
            setValue('total', parseFloat(quantity) * parseInt(value))

        }

    }


    const onChangeQuantity = (e: any) => {
        const { value } = e.target;
        let data : any = getValues()
        setValue('quantity', value);

        if (parseInt(value) <= 0 || value === "") {
            setValue('unitPrice', data?.unitPrice);
            setValue('seller_price', data?.seller_price);
            setError('quantity', { message: 'Minimum Quantity Required' });
            setOutOfStock(false);
        } else {
            if (data?.stock) {
                if (data?.stock_value) {
                    if (data?.stock_value < parseFloat(value)) {
                        setError('quantity', { message: 'Out of Stock' });
                        setOutOfStock(true);
                        return false;
                    }
                }
            }
            setError('quantity', { message: '' });
            //let unitprz = (parseInt(data?.unitPrice) * parseInt(value));
            setValue('unitPrice', data?.unitPrice);
            setValue('seller_price', data?.seller_price);
            setValue('total', (parseInt(data?.unitPrice) * parseInt(value)));
            setOutOfStock(false);
        }
    }


    const InitialPost = useCallback(async (data: any) => {
        try {
            data.id = order_iD;
            //data.productDetailsChangeStatus = true
            let datas = await postData('admin/order/edit', data);
            setProductDatas(datas?.data?.data)
            handleClose()
            toast.success('Product Updated Successfully')

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }

    }, [])






    const onChangeDeliveryCharge = (e: any) => {
        const { value } = e.target;

        setValue('deliveryPrice', value)
        SetDeliveryCharge(value)

    }

    const SubmitButton = async (item: any) => {

        data.seller_price = item?.seller_price
        data.unitPrice = item?.unitPrice
        data.quantity = item?.quantity
        data.total = item?.total
        data.product_tax = item?.product_tax
        data.price = item?.unitPrice

        let products = allProduct?.productDetails?.findIndex((res: any) => res?.product_id === item?.product_id && res?.variant_id === item?.variant_id);


        if (products !== -1) {
            allProduct.productDetails[products] = data
        }

        allProduct.id= order_iD
        allProduct.productDetailsChangeStatus= true

        InitialPost(allProduct)

        //const response = await postData('admin/order/edit', allProduct);

        // console.log({data, item, allProduct})
        // return false

        // setproductDetailsChangeStatus(true)
        // //return false
        // let product: any = [];


        // if (item?.variant_id) {
        //     product = allProduct?.productDetails?.filter((res: any) => res?.variant_id !== item?.variant_id).map((itm: any) => ({
        //         ...itm
        //     }));
        // } else {
        //     if (item?.attributes) {
        //         product = allProduct?.productDetails?.filter((prod: any) => (prod?.product_id === item?.product_id && !isEqual(prod?.attributes?.sort(), item?.attributes?.sort())) || prod?.product_id !== item?.product_id).map((itm: any) => ({
        //             ...itm
        //         }));
        //     }
        //     else {
        //         product = allProduct?.productDetails?.filter((res: any) => res?.product_id !== item?.product_id).map((itm: any) => ({
        //             ...itm
        //         }));
        //     }

        // }

        // item.title = data?.title;
        // item.name = data?.name;
        // item.price = item?.unitPrice * parseFloat(item?.quantity);

        // const { total, ...alldata } = item;
        // product.push(alldata);




        // try {
        //     if (order_iD) {
        //         let publishValue = {
        //             id: order_iD,
        //             productDetails: product,
        //             productDetailsChangeStatus: true,
        //             franchise_id: allProduct?.franchise_id,
        //             common_tax_charge: allProduct?.common_tax_charge,
        //             grand_total: allProduct?.grand_total,
        //             price_breakup: allProduct?.price_breakup,
        //             type: allProduct?.type,
        //             total_price: allProduct?.total_price,
        //             delivery_charge_details: allProduct?.delivery_charge_details,

        //         };



        //         const response = await postData('admin/order/edit', publishValue);



        //         const highestDelivery = product.reduce((highest: number, product: any) => {
        //             return Math.max(highest, parseFloat(product?.deliveryPrice));
        //         }, 0);

        //         allProduct['delivery_charge'] = highestDelivery;

        //         const rate = response?.data?.data?.productDetails?.reduce((initial: number, price: any) =>
        //             initial + (parseInt(price?.unitPrice) * parseInt(price?.quantity)), 0);

        //         let resetValue = {
        //             franchise_id: allProduct?.franchise_id,
        //             common_tax_charge: allProduct?.common_tax_charge,
        //             delivery_charge_details: allProduct?.delivery_charge_details,
        //             price_breakup: allProduct?.price_breakup,
        //             type: allProduct?.type,
        //             total_price: allProduct?.total_price,
        //             delivery_charge: highestDelivery,
        //             grand_total: parseInt(highestDelivery) + rate + allProduct?.platform_charge,
        //             total_amount: rate,
        //             platform_charge: allProduct?.platform_charge,
        //             productDetails: [...response?.data?.data?.productDetails]
        //         };



        //         setProductList(resetValue);
        //         toast.success('Order edit Successfully');
        //         handleClose();
        //     }


        // } catch (err) {
        //     let message = 'Unknown Error';
        //     if (err instanceof Error) message = err.message;
        //     reportError({ message });
        //     toast.error(message);
        // }
    }



    // const DeliverySubmit = () => {
    //     let deliveryPrice = getValues('deliveryPrice')
    //     if (parseInt(deliveryPrice) <= 0) {
    //         toast.warning('Delivery Price Cannot be Zero');
    //         return false;
    //     }
    //     allProduct['delivery_charge'] = getValues('deliveryPrice');
    //     allProduct['grand_total'] = parseInt(allProduct?.delivery_charge) + parseInt(allProduct?.total_amount);
    //     handleClose()
    // }
    const DeliverySubmit = () => {
        //setproductDetailsChangeStatus(true)
        let deliveryPrice = getValues('deliveryPrice');

        if (parseInt(deliveryPrice) <= 0) {
            toast.warning('Delivery Price Cannot be Zero');
            return false;
        }

        data.delivery_charge = parseInt(deliveryPrice);
        data.id= query?.id;
        data.deliveryChangeStatus= true


        console.log({data})

        // allProduct['delivery_charge'] = parseInt(deliveryPrice);
        // allProduct['grand_total'] = allProduct['total_amount'] + allProduct['delivery_charge'] + allProduct['platform_charge'];
        // let values = {
        //     franchise_id: allProduct?.franchise_id,
        //     common_tax_charge: allProduct?.common_tax_charge,
        //     grand_total: allProduct?.grand_total,
        //     price_breakup: allProduct?.price_breakup,
        //     type: allProduct?.type,
        //     total_price: allProduct?.total_price,
        //     id: query?.id,
        //     delivery_charge: deliveryPrice,
        //     productDetailsChangeStatus: true,
        //     delivery_charge_details: allProduct?.delivery_charge_details,
        //     productDetails: [...allProduct.productDetails]
        // }
        InitialPost(data)

        handleClose();
    };

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            fullWidth
            maxWidth={mode === 'product' ? 'md' : 'xs'}
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
                        }}>{mode === 'product' ? 'Edit Product' : 'Edit Delivery Charge'}</Typography>
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
                    {mode === 'product' ?
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.name}
                                    fieldName="name"
                                    placeholder={``}
                                    fieldLabel={"Product name"}
                                    disabled={false}
                                    view={true}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    onChangeValue={onChangePurchaseValue}
                                    type='number'
                                    control={control}
                                    error={errors.seller_price}
                                    fieldName="seller_price"
                                    placeholder={``}
                                    fieldLabel={"Seller Price"}
                                    disabled={false}
                                    view={true}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    onChangeValue={(e: any) => onChangeRegularValue(e)}
                                    // Values={regularValue}
                                    type='number'
                                    control={control}
                                    error={errors.unitPrice}
                                    fieldName="unitPrice"
                                    placeholder={``}
                                    fieldLabel={"Unit Price"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    onChangeValue={(e: any) => onChangeQuantity(e)}
                                    type='number'
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
                            <Grid item xs={12} lg={6}>
                                <CustomInput

                                    type='number'
                                    control={control}
                                    error={errors.total}
                                    fieldName="total"
                                    placeholder={``}
                                    fieldLabel={"Total Price"}
                                    disabled={false}
                                    view={true}

                                />
                            </Grid>

                        </Grid> :
                        <Grid item xs={12} lg={6}>
                            <CustomInput
                                onChangeValue={(e: any) => onChangeDeliveryCharge(e)}
                                type='text'
                                control={control}
                                error={errors.deliveryPrice}
                                fieldName="deliveryPrice"
                                placeholder={``}
                                fieldLabel={"Delivery Price"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>}

                    <Box py={3} display={'flex'} justifyContent={'center'}>
                        <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Update'}
                            //disabled={false}
                            disabled={outOfStock || false}
                            onClick={mode === "product" ? handleSubmit(SubmitButton) : DeliverySubmit} />


                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default ProductDetailEditModal