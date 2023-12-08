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
            defaultValues: {
                product_id: data?.product_id,
                name: `${data?.name} ${data?.title ? `,${data?.title}` : ""}`,
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
        setValue('quantity', value);

        if (parseInt(value) <= 0 || value === "") {
            setValue('unitPrice', data?.quantity * data?.unitPrice);
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
            let unitprz = (parseInt(data?.unitPrice) * parseFloat(value));
            setValue('unitPrice', data?.unitPrice);
            setValue('seller_price', data?.seller_price);
            setValue('total', unitprz);
            setOutOfStock(false);
        }
    }
    const onChangeDeliveryCharge = (e: any) => {
        const { value } = e.target;
        setValue('deliveryPrice', value)
        SetDeliveryCharge(value)
    }

    const SubmitButton = async (item: any) => {
        let product = [];
    
        if (item?.variant_id) {
            product = allProduct?.productDetails?.filter((res: any) => res?.variant_id !== item?.variant_id).map((itm: any) => ({
                ...itm
            }));
        } else {
            product = allProduct?.productDetails?.filter((res: any) => res?.product_id !== item?.product_id).map((itm: any) => ({
                ...itm
            }));
        }
    
        item.title = data?.title;
        item.name = data?.name;
        item.price = item?.unitPrice * parseFloat(item?.quantity);
    
        const { total, ...alldata } = item;
        product.push(alldata);
    
        try {
            if(order_iD){
                let publishValue = {
                    id: order_iD,
                    productDetails: product
                };
                console.log({publishValue});
                
                const response = await postData('admin/order/edit', publishValue);
        
                const highestDelivery = product.reduce((highest: number, product: any) => {
                    return Math.max(highest, parseFloat(product?.deliveryPrice));
                }, 0);
        
                allProduct['delivery_charge'] = highestDelivery;
        
                const rate = response?.data?.data?.productDetails?.reduce((initial: number, price: any) =>
                    initial + (parseInt(price?.unitPrice) * parseInt(price?.quantity)), 0);
        
                let resetValue = {
                    delivery_charge: highestDelivery,
                    grand_total: parseInt(highestDelivery) + rate + allProduct?.platform_charge,
                    total_amount: rate,
                    platform_charge: allProduct?.platform_charge,
                    productDetails: [...response?.data?.data?.productDetails]
                };
               
                setProductList(resetValue);
                toast.success('Order edit Successfully');
                handleClose(); 
            }
            
          
        } catch (err) {
           
        }
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
        let deliveryPrice = getValues('deliveryPrice');
        if (parseInt(deliveryPrice) <= 0) {
            toast.warning('Delivery Price Cannot be Zero');
            return false;
        }

        allProduct['delivery_charge'] = parseInt(deliveryPrice);
        allProduct['grand_total'] =
            allProduct['total_amount'] + allProduct['delivery_charge'] + allProduct['platform_charge'];
    
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
                                    fieldLabel={"Unit Price"}
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