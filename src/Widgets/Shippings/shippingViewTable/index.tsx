import React, { useCallback, useContext, useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import ProductDetailEditModal from '../Modal/ProductDetailEditModal';
import Custombutton from '@/components/Custombutton';
import AddProductModal from '../Modal/AddProductModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from "react-toastify";
import VendorStatusContext from '@/helpers/shippingStatus';
import AddNewProductModal from '../Modal/AddNewProductModal';
import EditProductModal from '../Modal/EditProductModal';
import { isEqual } from 'lodash';
type props = {
    res: any,
    readonly: any,
    id: any,
    SetDeliveryCharge: any,
    setStoreList: any,
    onApiSuccess: (newAddedProduct: string) => void;
}


const ShippingTable = ({ res, readonly, id, SetDeliveryCharge, setStoreList, onApiSuccess }: props) => {





    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setaddModalOpen] = useState(false)
    const [modalDelete, setModalDelete] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [singleList, setSingleList] = useState([]);
    const [mode, setMode] = useState<any>(null)
    const [productList, setProductList] = useState<any>(null);
    const [productDetailsChangeStatus, setproductDetailsChangeStatus] = useState(false)

    const [newAddedProduct, setnewAddedProduct] = useState<any>()
    const [platFomCharge, setplatFomCharge] = useState<any>()
    const [productDatas, setProductDatas] = useState<any>(null)





    const handleClose = useCallback(() => {
        setModalOpen(false);
        setSingleList([])
        setMode(null)
    }, [modalOpen, singleList, mode]);

    const handleOpen = useCallback((data: any, mode: string) => {
        if (id) {
            setSingleList(data);
            setModalOpen(true);
            console.log({ data });

            setMode(mode)
        }
        else {
            setSingleList(data);
            setEditModal(true);

            setMode(mode)
        }
    }, [modalOpen, singleList, mode]);


    const handleOpenAddModal = useCallback(() => {
        if (res === null) {
            setaddModalOpen(true);
        } else {
            setAddOpen(true);
        }
    }, [res]);

    const handleCloseAddModal = useCallback(() => {
        if (res === null) {
            setaddModalOpen(false);
        } else {
            setAddOpen(false);
        }
    }, [res]);


    // useEffect(() => {
    //     getPlatFormCharge()
    // }, [])


    // const getPlatFormCharge = async () => {

    //     try {

    //         const response = await fetchData('common/platformcharge')
    //         let { data } = response?.data


    //         setplatFomCharge(data?.platformCharge)

    //     } catch (err) {
    //         toast.error("cant't find platform charge")


    //     }
    // }

    // const handleOpenDeleteModal = useCallback(() => {
    //     setModalDelete(true)
    // }, [modalDelete])

    // const handleCloseDeleteModal = useCallback(() => {
    //     setModalDelete(false)
    // }, [modalDelete])

    const handleApiSuccess = (AddedProduct: string) => {
        setnewAddedProduct(AddedProduct)
 
    };


    useEffect(() => {

        if (res === null && newAddedProduct) {
            onApiSuccess(newAddedProduct)



            let pricedata = {
                delivery_charge: parseInt(newAddedProduct?.delivery_charge),
                grand_total: parseInt(newAddedProduct?.delivery_charge) + parseInt(newAddedProduct?.total_amount) + platFomCharge,
                total_amount: parseInt(newAddedProduct?.total_amount),
                franchise_id: newAddedProduct?.franchise,
                type: process.env.NEXT_PUBLIC_TYPE,
                total_price:newAddedProduct?.total_amount,
                common_tax_charge:newAddedProduct?.common_tax_charge,
                other_charges:newAddedProduct?.other_charges,
                price_breakup:newAddedProduct?.price_breakup,
                delivery_charge_details:newAddedProduct?.delivery_charge_details
               

            }



            let productDetails: any[] = newAddedProduct?.product_details?.productDetails?.map((itm: any) => ({
                name: itm?.name,
                price: itm?.price,
                quantity: itm?.quantity,
                unitPrice: itm?.unitPrice,
                image: itm?.image,
                type: itm?.type,
                variant_id: itm?.variant_id,
                // product_id: itm?.product_id,
                store_name: itm?.store_name,
                store_address: itm?.store_address,
                vendor: itm?.vendor,
                deliveryPrice: itm?.deliveryPrice,
                seller_price: itm?.seller_price,
                stock_value: itm?.stock_value,
                product_id: itm?.product_id,
                vendor_mobile: itm?.vendor_mobile,
                description: itm?.description,
                attributes: itm?.attributes,
                variants:itm?.selected_variants,
                product_tax: itm?.product_tax
               


                // seller_price: itm?.type === "single" ? itm?.productdata?.seller_price : itm?.variants?.seller_price,
                // deliveryPrice: itm?.type === "single" ? itm?.deliveryPrice : itm?.variants?.fixed_delivery_price,
                // fixed_delivery_price: itm?.type === "single" ? itm?.deliveryPrice : itm?.variants?.fixed_delivery_price,
                // title: itm?.type === "single" ? null : itm?.variants?.title,
                // stock_value: itm?.type === "single" ? (itm?.stock_value + parseFloat(itm?.quantity)) : (itm?.variants?.stock_value + parseFloat(itm?.quantity)),
                // stock: itm?.type === "single" ? itm?.stock : itm?.variants?.stock,
                // Add other properties as needed
            }));



            let Combine = {
                ...pricedata,
                productDetails
            }
            setProductList(Combine);


            // const result = productDetails?.map((res: any) => res?.vendor)
            // setVendorStatus(productDetails?.map((res: any) => ({ "vendor_id": "", "status": "" })))


            // const uniqueArray = result.filter((obj, index, self) => {

            //     return index === self.findIndex((o) => o._id === obj._id);
            // });
            // const uniqueNames = Array.from(new Set(result.map(res => res)));


            let store = productDetails?.map((res: any) => (res?.vendor?._id));
            setStoreList(store)


        }
        else if (res) {
           
       
            let pricedata = {
                delivery_charge: parseInt(res?.delivery_charge),
                grand_total: res?.grand_total,
                total_amount: res?.total_amount,
                // platform_charge: res?.platform_charge,
                franchise_id: res?.franchise,
                type: process.env.NEXT_PUBLIC_TYPE,
                total_price:res?.total_amount,
                common_tax_charge:res?.common_tax_charge,
                other_charges:res?.other_charges,
                price_breakup:res?.price_breakup,
                delivery_charge_details:res?.delivery_charge_details

            }
            let productDetails: []
            productDetails = res?.product_details?.map((itm: any) => ({
                name: itm?.name,
                price: itm?.price,
                quantity: itm?.quantity,
                unitPrice: itm?.unitPrice,
                image: itm?.image,
                type: itm?.type,
                variant_id: itm.variant_id,
                product_id: itm?.product_id,
                store_name: itm?.productdata?.vendors?.store_name,
                store_address: itm?.productdata?.vendors?.store_address,
                vendor: itm?.productdata?.vendors,
                seller_price: itm?.type === "single" ? itm?.productdata?.seller_price : itm?.variants?.seller_price,
                deliveryPrice: itm?.type === "single" ? itm?.deliveryPrice : itm?.variants?.fixed_delivery_price,
                // fixed_delivery_price: itm?.type === "single" ? itm?.deliveryPrice : itm?.variants?.fixed_delivery_price,
                title: itm?.type === "single" ? null : itm?.variants?.title,
                stock_value: itm?.type === "single" ? (itm?.stock_value + parseFloat(itm?.quantity)) : (itm?.variants?.stock_value + parseFloat(itm?.quantity)),
                stock: itm?.type === "single" ? itm?.stock : itm?.variants?.stock,
                attributes: itm?.attributes,
                description: itm?.description,
                offer_date_from: itm?.offer_date_from,
                offer_date_to: itm?.offer_date_to,
                offer_price: itm?.offer_price,
                store_commission: itm?.store_commission,
                product_commission: itm?.product_commission,
                variants:itm?.selected_variants,
                product_tax: itm?.product_tax
               
            }))


            let Combine = {
                ...pricedata,
                productDetails

            }
            setProductList(Combine);
            // const result = productDetails?.map((res: any) => res?.vendor)
            // setVendorStatus(productDetails?.map((res: any) => ({ "vendor_id": "", "status": "" })))


            // const uniqueArray = result.filter((obj, index, self) => {

            //     return index === self.findIndex((o) => o._id === obj._id);
            // });
            // const uniqueNames = Array.from(new Set(result.map(res => res)));


            let store = productDetails?.map((res: any) => (res?.vendor?._id));
            setStoreList(store)

        }

    }, [res, newAddedProduct])

    // useEffect(() => {
    //     console.log(productList);

    // }, [productList])







    const InitialPost = useCallback(async (data: any) => {



        try {
            let postDatas = await postData('admin/order/edit', data);
            setProductDatas(postDatas?.data?.data)
            console.log({postDatas})

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }

    }, [productList])


    console.log({productDatas}, "product")








    useEffect(() => {
        if (productList) {
            if (newAddedProduct) {
                let value = {
                    id: newAddedProduct?.product_details?.product_id,
                    // productDetails: [productList?.product_details?.productDetails],
                    //  product_id:newAddedProduct?.product_details?._id
                }
                // InitialPost(value)
            }
            else {


                console.log({productList}, "productList");

                let products = productList.productDetails?.map((prod: any) => {
                    const { vendor, ...other} = prod
                    return{
                        ...other
                    }
                })

                let value = {
                    id: id,
                    type: process.env.NEXT_PUBLIC_TYPE,
                    delivery_charge: productList?.delivery_charge,
                    productDetailsChangeStatus: productDetailsChangeStatus,
                    franchise_id: productList?.franchise_id,
                    total_price:productList?.total_amount,
                    common_tax_charge:productList?.common_tax_charge,
                    other_charges:productList?.other_charges,
                    price_breakup:productList?.price_breakup,
                    productDetails: products,
                    grand_total: productList?.grand_total,
                    product_tax: productList?.product_tax
                }

                InitialPost(value)
            }


        }

    }, [productList])


    const removeItemApi = async (pdct_id: any) => {
        let value = {
            id: id,
            product_id: pdct_id
        }
        try {
            const res = await postData('admin/orderdetails/delete', value);
            toast.success('Deleted successfully')
            return res;

        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }
    }


    const removeProduct = async (row: any) => {
  
        //return false;
        if (id) {
            if (productList?.productDetails?.length < 2) {
                toast.warning('You have to add atleast Two Product !..')
                return false;
            }
            let product: any[] = []
            if (row?.type === "variant") {
                product = productList?.productDetails?.filter((res: any) => res?.variant_id !== row?.variant_id);
            } else {
                if (row?.attributes?.length > 0) {
                    product = productList?.productDetails?.filter((prod: any) => (prod?.product_id === row?.product_id && !isEqual(prod?.attributes?.sort(), row?.attributes?.sort())) || prod?.product_id !== row?.product_id);
                }
                else {
                    product = productList?.productDetails?.filter((res: any) => res?.product_id !== row?.product_id);
                }


            }

            const highestDelivery = product.reduce((highest: any, delivery: any) => {
                return Math.max(highest, delivery.deliveryPrice);
            }, 0);



            const res = await removeItemApi(row?.product_id);


            if (res?.data?.message === "Success") {
                SetDeliveryCharge(highestDelivery)
                if (product?.length > 0) {
                    const rate = product?.reduce((inital: any, price: any) => inital + (parseFloat(price?.unitPrice) * parseFloat(price?.quantity)), 0);
                    let pricedata = {
                        delivery_charge: Math.ceil(highestDelivery),
                        grand_total: (parseInt(productList?.delivery_charge) + rate + productList?.platform_charge),
                        total_amount: rate,
                        platform_charge: productList?.platform_charge,
                    }
                    setProductList({
                        ...pricedata,
                        productDetails: [...product],
                    });
                    let store = product?.map((res: any) => (res?.vendor?._id));
                    setStoreList(store)

                } else {
                    let pricedata = {
                        delivery_charge: "",
                        grand_total: "",
                        total_amount: ""
                    }
                    setProductList({
                        ...pricedata,
                        productDetails: [...product],
                    });

                    let store = product?.map((res: any) => (res?.vendor?._id));
                    setStoreList(store)
                }
            }

        }
        else {
   
            //return false;
            let product: any[] = []
            if (row?.type === "variant") {
                product = productList?.productDetails?.filter((res: any) => res?.variant_id !== row?.variant_id);
            }
            else {
                if (row?.attributes?.length > 0) {
                    product = productList?.productDetails?.filter((prod: any) => (prod?.product_id === row?.product_id && !isEqual(prod?.attributes?.sort(), row?.attributes?.sort())) || prod?.product_id !== row?.product_id);
                }
                else {
                    // console.log({product: productList?.productDetails, row})
                    // return false;
                    product = productList?.productDetails?.filter((res: any) => res?.product_id !== row?.product_id);
                }

            }

            const highestDelivery = product.reduce((highest: any, delivery: any) => {
                return Math.max(highest, delivery.deliveryPrice);
            }, 0);


            let publishValue = {
                id: newAddedProduct ? newAddedProduct?.product_details?._id : null,
                productDetails: product?.length > 0 ? product : null
            }

            const response = await postData('admin/order/createproduct', publishValue);
            const AddedProduct = response?.data?.data;
            handleApiSuccess(AddedProduct)

        }

    }







    return (
        <Box>
            <Box>

                {(readonly || res === null) && <Box py={1} display={'flex'} justifyContent={'flex-end'}>

                    <Custombutton
                        btncolor=''
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={'Add'}
                        disabled={false}
                        onClick={handleOpenAddModal} />
                </Box>}
            </Box>
            {productList?.productDetails && <TableContainer component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Store/Pickup Address</TableCell>
                            <TableCell align="center">Description</TableCell>

                            <TableCell align="center">Quantity</TableCell>

                            <TableCell align="center">Unit Price</TableCell>
                            <TableCell align="center">Total Price</TableCell>
                            {<TableCell align="center"></TableCell>}

                            {<TableCell align="center"></TableCell>}
                            {<TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productDatas?.productDetails?.map((row: any) => {
                            console.log({ row })
                            return (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {/* {row?.name}  {row.title ? (row.title) : ''} */}
                                        {row?.name}
                                        {(row?.attributes?.length > 0) ? `(${row?.attributes?.join(', ')})` : ''}
                                    </TableCell>
                                    <TableCell align="center">{row.store_name},{row?.store_address},{row.vendor?.vendor_mobile}{ }</TableCell>
                                    <TableCell align="center">{row.description}</TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">{(row?.price)}</TableCell>
                                    <TableCell align="center">{(row?.quantity * parseFloat(row?.price)).toFixed(2)}</TableCell>
                                    {/* {id && ( */}
                                    {(readonly || res === null) && <>
                                        <TableCell align="center"> <BorderColorTwoToneIcon
                                            onClick={() => { handleOpen(row, 'product') }}
                                            style={{
                                                color: '#58D36E',
                                                cursor: 'pointer'
                                            }}
                                        /></TableCell>
                                        <TableCell > <DeleteOutlineTwoToneIcon
                                            onClick={() => { removeProduct(row) }}
                                            style={{
                                                color: 'red',
                                                cursor: 'pointer'
                                            }}
                                        /></TableCell>
                                    </>}
                                    {/* )} */}


                                </TableRow>
                            )
                        })}

                        <TableRow>
                            <TableCell rowSpan={5} />
                            <TableCell colSpan={3}></TableCell>
                            <TableCell align="right">Sub-Total</TableCell>
                            <TableCell align="center">
                                ₹ {isNaN(parseFloat(productDatas?.total_price)) ? 0 : parseFloat(productDatas?.total_price).toFixed(2)}
                            </TableCell>
                            {(readonly || res === null) && <TableCell align="center"></TableCell>}
                            {(readonly || res === null) && <TableCell align="center"></TableCell>}
                        </TableRow>
                        <TableRow>

                            <TableCell colSpan={3}></TableCell>
                            <TableCell align="right" >{'Delivery Charge'}</TableCell>
                            <TableCell align="center">₹ {productDatas?.delivery_charge}</TableCell>
                            {(readonly || res === null) && <TableCell align="center"> <BorderColorTwoToneIcon
                                onClick={() => { handleOpen(productDatas, 'delivery') }}
                                style={{
                                    color: '#58D36E',
                                    cursor: 'pointer'
                                }}
                            /></TableCell>}
                        </TableRow>
                        {productDatas?.price_breakup?.map((breakup: any) => {
                            if (breakup?.charge_name?.toLowerCase().includes('delivery charge')) return false;
                            return (
                                <TableRow>

                                    <TableCell colSpan={3}></TableCell>
                                    <TableCell align="right" >{breakup?.charge_name}</TableCell>
                                    <TableCell align="center">₹ {breakup?.price}</TableCell>
                                </TableRow>
                            )
                        })}



                        {/* <TableRow>
                            <TableCell colSpan={3}></TableCell>
                            <TableCell align="right">Platform Charge</TableCell>
                            <TableCell align="center">
                                ₹ {isNaN(parseFloat(productList?.platform_charge)) ? 0 : parseFloat(productList?.platform_charge).toFixed(2)}
                            </TableCell>
                        </TableRow> */}



                        <TableRow>
                            <TableCell colSpan={3}></TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">  ₹ {isNaN(parseFloat(productDatas?.grand_total)) ? 0 : parseFloat(productDatas?.grand_total).toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>}



            {modalOpen &&
                <ProductDetailEditModal
                    setproductDetailsChangeStatus={setproductDetailsChangeStatus}
                    SetDeliveryCharge={SetDeliveryCharge}
                    order_iD={id}
                    allProduct={productDatas}
                    open={modalOpen}
                    handleClose={handleClose}
                    data={singleList}
                    mode={mode}
                    setProductList={setProductList}
                    setProductDatas={setProductDatas}
                />}

            {editModal &&
                <EditProductModal
                    setproductDetailsChangeStatus={setproductDetailsChangeStatus}
                    SetDeliveryCharge={SetDeliveryCharge}
                    order_iD={id}
                    allProduct={productList}
                    open={editModal}
                    handleClose={() => setEditModal(false)}
                    data={singleList}
                    mode={mode}
                    added={newAddedProduct}
                    setProductList={setProductList}
                    onApiSuccess={handleApiSuccess}
                />}
            {addOpen &&
                <AddProductModal
                    setStoreList={setStoreList}
                    order_id={id}
                    SetDeliveryCharge={SetDeliveryCharge}
                    allProduct={productList}
                    setaddProductList={setProductList}
                    open={addOpen}
                    handleClose={handleCloseAddModal}
                />}
            {addModalOpen &&
                <AddNewProductModal
                    setStoreList={setStoreList}
                    order_id={id}
                    SetDeliveryCharge={SetDeliveryCharge}
                    allProduct={productList}
                    setaddProductList={setProductList}
                    added={newAddedProduct}
                    open={addModalOpen}
                    onApiSuccess={handleApiSuccess}
                    handleClose={handleCloseAddModal}
                />

            }

        </Box>
    )
}

export default ShippingTable