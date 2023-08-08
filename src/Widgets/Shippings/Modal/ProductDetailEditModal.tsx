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


type props = {
    handleClose: any;
    open: boolean;
    data: any;
    mode: string | null;
    allProduct: any;
    order_iD: string;
    setProductList: any,
    SetDeliveryCharge?: any
}
type Inputs = {
    name: string,
    quantity: string,
    total: number,
    seller_price: any,
    unitPrice: any,
    deliveryPrice: any,
    product_id: string,
    image: string,
    type: any,
    variant_id: any,
    store_address: string,
    store_name: string,
    vendor_mobile: string,
    delivery: any





};

const ProductDetailEditModal = ({ handleClose, open, data, mode, allProduct, order_iD, setProductList, SetDeliveryCharge }: props) => {



    const schema = yup
        .object()
        .shape({
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
            defaultValues: {
                product_id: data?.product_id,
                name: `${data?.name},${data?.title ? data?.title : ''}` || "",
                quantity: data?.quantity || "",
                total: (data?.quantity * data?.unitPrice),
                seller_price: data?.seller_price,
                unitPrice: data?.unitPrice,
                deliveryPrice: allProduct?.delivery_charge,
                image: data?.image,
                type: data?.type,
                variant_id: data?.variant_id,
                store_address: data?.store_address,
                store_name: data?.store_name,
                vendor_mobile: data?.vendor_mobile,
                delivery: data?.delivery
            }

        });



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
        setValue('quantity', value)

        // let unitprice = getValues('unitPrice');
        // let purchaseprice = getValues('seller_price');

        if (parseInt(value) <= 0 || value === "") {
            setValue('unitPrice', data?.quantity * data?.unitPrice)
            setValue('seller_price', data?.seller_price)
            setError('quantity', { message: 'Minimum Quantity Required' })
        } else {
            if (data?.stock_value) {
                if (data?.stock_value < parseFloat(value)) {
                    setError('quantity', { message: 'Out of Stock' })
                    return false;
                }
            }

            setError('quantity', { message: '' })
            // let purchsePrz = (parseInt(data?.seller_price) * parseFloat(value));
            let unitprz = (parseInt(data?.unitPrice) * parseFloat(value));
            setValue('unitPrice', data?.unitPrice);
            setValue('seller_price', data?.seller_price);
            setValue('total', unitprz);
        }

    }

    const onChangeDeliveryCharge = (e: any) => {
        const { value } = e.target;
        setValue('deliveryPrice', value)
        SetDeliveryCharge(value)
    }



    const SubmitButton = async (data: any) => {


        let product = []

        if (data?.variant_id) {
            product = allProduct?.productDetails?.filter((res: any) => res?.variant_id !== data?.variant_id).map((itm: any) => (
                {
                    ...itm
                }))

        } else {
            product = allProduct?.productDetails?.filter((res: any) => res?.product_id !== data?.product_id).map((itm: any) => (
                {
                    ...itm
                }))
        }



        data.price = (data?.unitPrice * parseFloat(data?.quantity));
        const { total, ...alldata } = data;

        product.push(alldata)

        try {
            let publishValue = {
                id: order_iD,
                productDetails: product
            }

            const response = await postData('admin/order/edit', publishValue);
            const rate = response?.data?.data?.productDetails?.reduce((inital: any, price: any) => inital + (parseInt(price?.unitPrice) * parseInt(price?.quantity)), 0)

            let resetvalue = {
                delivery_charge: data?.deliveryPrice,
                grand_total: (parseInt(data?.deliveryPrice) + rate),
                total_amount: rate,
                productDetails: [...response?.data?.data?.productDetails]
            }
            setProductList(resetvalue)
            toast.success('Order edit Successfully')
            handleClose()

        } catch (err: any) {
            toast.error(err)
        }

    }

    const DeliverySubmit = () => {
        let deliveryPrice = getValues('deliveryPrice')
        if (parseInt(deliveryPrice) <= 0) {
            toast.warning('Delivery Price Cannot be Zero');
            return false;
        }
        allProduct['delivery_charge'] = getValues('deliveryPrice');
        allProduct['grand_total'] = parseInt(allProduct?.delivery_charge) + parseInt(allProduct?.total_amount);
        handleClose()
    }

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
                                    view={false}
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
                                    fieldLabel={"Regular Price"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <CustomInput
                                    onChangeValue={(e: any) => onChangeQuantity(e)}
                                    type='number~'
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
                            disabled={false}
                            onClick={mode === "product" ? handleSubmit(SubmitButton) : DeliverySubmit} />
                    </Box>
                </DialogContent>



            </Box>

        </Dialog>
    )
}

export default ProductDetailEditModal