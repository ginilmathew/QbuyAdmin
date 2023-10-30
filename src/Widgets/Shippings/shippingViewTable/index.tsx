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
type props = {
    res: any,
    readonly: any,
    id: any,
    SetDeliveryCharge: any,

}


const ShippingTable = ({ res, readonly, id, SetDeliveryCharge }: props) => {


    console.log({ res })

    const [modalOpen, setModalOpen] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [singleList, setSingleList] = useState([]);
    const [mode, setMode] = useState<any>(null)
    const [productList, setProductList] = useState<any>(null);


    console.log({ productList }, 'PRODUCT LIT')

    const handleClose = useCallback(() => {
        setModalOpen(false);
        setSingleList([])
        setMode(null)
    }, [modalOpen, singleList, mode]);

    const handleOpen = useCallback((data: any, mode: string) => {
        setSingleList(data);
        setModalOpen(true);
        setMode(mode)
    }, [modalOpen, singleList, mode]);


    const handleOpenAddModal = useCallback(() => {
        setAddOpen(true)
    }, [addOpen])

    const handleCloseAddModal = useCallback(() => {
        setAddOpen(false)
    }, [addOpen])

    

    const handleOpenDeleteModal = useCallback(() => {
        setModalDelete(true)
    }, [modalDelete])

    const handleCloseDeleteModal = useCallback(() => {
        setModalDelete(false)
    }, [modalDelete])



    useEffect(() => {
        if (res) {
            let pricedata = {
                delivery_charge: parseInt(res?.delivery_charge),
                grand_total: res?.grand_total,
                total_amount: res?.total_amount,
                platform_charge: res?.platform_charge,
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

            }))


            let Combine = {
                ...pricedata,
                productDetails
            }

            // const result = productDetails?.map((res: any) => res?.vendor)
            // setVendorStatus(productDetails?.map((res: any) => ({ "vendor_id": "", "status": "" })))


            // const uniqueArray = result.filter((obj, index, self) => {

            //     return index === self.findIndex((o) => o._id === obj._id);
            // });
            // const uniqueNames = Array.from(new Set(result.map(res => res)));



            setProductList(Combine);

        }


    }, [res])







    const InitialPost = useCallback(async (data: any) => {
        try {
            await postData('admin/order/edit', data);
        } catch (err) {
            let message = 'Unknown Error'
            if (err instanceof Error) message = err.message
            reportError({ message })
            toast.error(message)
        }

    }, [productList])


   

    useEffect(() => {
        if (productList) {
            let value = {
                id: id,
                productDetails: [...productList.productDetails]
            }
            InitialPost(value)
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
        if (productList?.productDetails?.length < 2) {
            toast.warning('You have to add atleast Two Product !..')
            return false;
        }
        let product: any[] = []
        if (row?.type === "variant") {
            product = productList?.productDetails?.filter((res: any) => res?.variant_id !== row?.variant_id);
        } else {
            product = productList?.productDetails?.filter((res: any) => res?.product_id !== row?.product_id);

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
            }
        }
    }


    // const vendorStatusChange = (e: any, index: number, res: any) => {
    //     console.log(e, index, res, "EVEMNT RES")

    //     const { value } = e.target;
    //     vendorStatusData[index]['vendor_id'] = res?._id;
    //     vendorStatusData[index]['status'] = value;



    // }



    return (
        <Box>
            <Box>

                {readonly && <Box py={1} display={'flex'} justifyContent={'flex-end'}>
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
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Store/Pickup Address</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Unit Price</TableCell>
                            <TableCell align="center">Total Price</TableCell>
                            {readonly && <TableCell align="center"></TableCell>}
                            {readonly && <TableCell align="center"></TableCell>}
                            {readonly && <TableCell align="center"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productList?.productDetails?.map((row: any) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {/* {row?.name}  {row.title ? (row.title) : ''} */}
                                    {row?.name}  {row.title ? `(${row.title})` : ''}

                                </TableCell>
                                <TableCell align="center">{row.store_name},{row?.store_address},{row.vendor?.vendor_mobile}{ }</TableCell>
                                <TableCell align="center">{row.quantity}</TableCell>
                                <TableCell align="center">{(row?.unitPrice)}</TableCell>
                                <TableCell align="center">{(row?.quantity * row?.unitPrice).toFixed(2)}</TableCell>
                                {readonly && <TableCell align="center"> <BorderColorTwoToneIcon
                                    onClick={() => { handleOpen(row, 'product') }}
                                    style={{
                                        color: '#58D36E',
                                        cursor: 'pointer'
                                    }}
                                /></TableCell>}
                                {readonly && <TableCell > <DeleteOutlineTwoToneIcon
                                    onClick={() => { removeProduct(row) }}
                                    style={{
                                        color: 'red',
                                        cursor: 'pointer'
                                    }}
                                /></TableCell>}
                            </TableRow>
                        ))}
                        <TableRow >
                            <TableCell rowSpan={5} />
                            <TableCell colSpan={2}></TableCell>
                            <TableCell align="right">Sub-Total</TableCell>
                            <TableCell align="center">₹ {parseFloat(productList?.total_amount)?.toFixed(2)}</TableCell>
                            {readonly && <TableCell align="center"></TableCell>}
                            {readonly && <TableCell align="center"></TableCell>}
                        </TableRow>

                        <TableRow>

                            <TableCell colSpan={2}></TableCell>
                            <TableCell align="right" >Delivery Charge (SlotBased)</TableCell>
                            <TableCell align="center">₹ {productList?.delivery_charge}</TableCell>
                            {(readonly && productList?.productDetails?.length > 0) && <TableCell align="center"> <BorderColorTwoToneIcon
                                onClick={() => { handleOpen(productList, 'delivery') }}
                                style={{
                                    color: '#58D36E',
                                    cursor: 'pointer'
                                }}
                            /></TableCell>}
                        </TableRow>

                       
                        <TableRow>
                            <TableCell colSpan={2}></TableCell>
                            <TableCell align="right">Platform Charge</TableCell>
                            <TableCell align="center">
                                ₹ {isNaN(productList?.platform_charge) ? 'Nil' : parseFloat(productList?.platform_charge).toFixed(2)}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={2}></TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">₹ {parseFloat(productList?.grand_total)?.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>



            {modalOpen &&
                <ProductDetailEditModal
                    SetDeliveryCharge={SetDeliveryCharge}
                    order_iD={id}
                    allProduct={productList}
                    open={modalOpen}
                    handleClose={handleClose}
                    data={singleList}
                    mode={mode}
                    setProductList={setProductList}
                />}
            {addOpen &&
                <AddProductModal
                    order_id={id}
                    SetDeliveryCharge={SetDeliveryCharge}
                    allProduct={productList}
                    setaddProductList={setProductList}
                    open={addOpen}
                    handleClose={handleCloseAddModal}
                />}

        </Box>
    )
}

export default ShippingTable