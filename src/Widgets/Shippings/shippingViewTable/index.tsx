import React, { useCallback, useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import ProductDetailEditModal from '../Modal/ProductDetailEditModal';
import Custombutton from '@/components/Custombutton';
import AddProductModal from '../Modal/AddProductModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { postData } from '@/CustomAxios';
import { toast } from "react-toastify";
type props = {
    res: any,
    readonly: any,
    id: any
}


const ShippingTable = ({ res, readonly, id }: props) => {




    const [modalOpen, setModalOpen] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [singleList, setSingleList] = useState([]);
    const [mode, setMode] = useState<any>(null)
    const [productList, setProductList] = useState<any>(null);



    console.log({ productList })

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
                delivery_charge: res?.delivery_charge,
                grand_total: res?.grand_total,
                total_amount: res?.total_amount
            }
            let productDetails: []
            productDetails = res?.product_details?.map((itm: any) => ({
                name: itm?.name,
                price: itm?.price,
                quantity: itm?.quantity,
                unitPrice: itm?.unitPrice,
                image: itm?.image,
                type: itm?.type,
                variant_id: itm?.variant_id,
                product_id: itm?.product_id,
                store_name: itm?.productdata?.vendors?.store_name,
                store_address: itm?.productdata?.vendors?.store_address,
                vendor_mobile: itm?.productdata?.vendors?.vendor_mobile,
                seller_price: itm?.productdata?.seller_price

            }))
            let Combine = {
                ...pricedata,
                productDetails
            }
            setProductList(Combine)
        }


    }, [res])




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
        let product: any[] = []
        product = productList?.productDetails?.filter((res: any) => res?.product_id !== row?.product_id);
        const res = await removeItemApi(row?.product_id);
        if (res?.data?.message === "Success") {
            if (product?.length > 0) {
                const rate = product?.reduce((inital: any, price: any) => inital + (parseInt(price?.unitPrice) * parseInt(price?.quantity)), 0);
                let pricedata = {
                    delivery_charge: productList?.delivery_charge,
                    grand_total: (parseInt(productList?.delivery_charge) + rate),
                    total_amount: rate
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




    return (
        <Box>
            <Box>

                <Box py={1} display={'flex'} justifyContent={'flex-end'}>
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
                </Box>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productList?.productDetails?.map((row: any) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row?.name}  {row.variants ? row.variants?.title : ''}
                                </TableCell>
                                <TableCell align="center">{row.store_name},{row?.store_address},{row.vendor_mobile}{ }</TableCell>
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
                            <TableCell align="center">₹ {productList?.total_amount}</TableCell>
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
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">₹ {productList?.grand_total}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {modalOpen &&
                <ProductDetailEditModal
                    order_iD={id}
                    allProduct={productList}
                    open={modalOpen}
                    handleClose={handleClose}
                    data={singleList}
                    mode={mode}
                    setProductList={setProductList}
                />}
            {addOpen && <AddProductModal
                open={addOpen}
                handleClose={handleCloseAddModal}


            />}

            {/*   
           {modalOpen && <Dialog
                open={modalOpen}
                onClose={handleCloseDeleteModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'xs'}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want Delete ?
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal}>No</Button>
                    <Button onClick={removeProduct} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog> } */}


        </Box>
    )
}

export default ShippingTable