
import CustomTable from '@/components/CustomTable';
import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { DialogProps } from '@mui/material/Dialog';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { GridCloseIcon, GridColDef } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment';
import { fetchData, postData } from '@/CustomAxios';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
type props = {
    res: any,
    isReadOnly: any;
    id: any,
    SetDeliveryCharge: any,
    setStoreList: any

}
interface Product {
    deliveryPrice: number;
    image: string;
    name: string;
    price: number;
    product_id: string;
    quantity?: number;
    unitPrice?: number;
}

interface SimpleDialogProps {
    onClose: () => void;
    open: boolean;
    order_id: string | null;
    isReadOnly: boolean;
}


const CustomerLogsModal = (props: SimpleDialogProps & { order_id: string | null }) => {
    const { onClose, open, order_id } = props;


    const [customerLog, setCustomerLog] = useState<any>(null);
    const [listLog, setListLog] = useState<any>([]);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [response, setResponse] = useState<any>(null);

    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue, } = useForm<any>({
            defaultValues: {

            }
        });



    const customerLogs = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/account/customers/show-order/${order_id}`);
            setResponse(response);
            reset(response?.data?.data);
            const customerLogValue = response?.data?.data?.total_orders?.product_details;
            setCustomerLog(customerLogValue);
            setLoading(false);
        } catch (err: any) {
            toast.error(err.message || 'Error fetching OTP data');
            setLoading(false);
        }
    };




    useEffect(() => {

        if (order_id) {
            customerLogs();
        }
    }, [order_id]);


    const clearData = () => {
        setListLog([])
        onClose()
    }

    return (
        <Box>
            <Dialog onClose={clearData} open={open} fullWidth={true}
                maxWidth={'xl'} >
                <Box p={2} >
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>

                        </Box>

                        <Box onClick={onClose}>
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
                                <GridCloseIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                        </Box>
                    </Box>
                    <DialogContent>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="center">Store/Pickup Address</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Unit Price</TableCell>
                                        <TableCell align="center">Total Price</TableCell>
                                        {props.isReadOnly && <TableCell align="center"></TableCell>}
                                        {props.isReadOnly && <TableCell align="center"></TableCell>}
                                        {props.isReadOnly && <TableCell align="center"></TableCell>}

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customerLog && customerLog.map((customerOrder: any, index: any) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {customerOrder.name} {/* Display the name */}
                                            </TableCell>
                                            <TableCell align="center">{customerOrder?.productdata?.store?.name},{customerOrder?.productdata?.vendors?.store_address},{customerOrder?.productdata?.vendors?.vendor_mobile}{ }</TableCell>
                                            <TableCell align="center">{customerOrder.quantity}</TableCell>
                                            <TableCell align="center">
                                                {customerOrder.unitPrice}
                                            </TableCell>
                                            <TableCell align="center">{(customerOrder?.quantity * customerOrder?.unitPrice).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell rowSpan={5} />
                                        <TableCell colSpan={2}></TableCell>
                                        <TableCell align="right">Sub-Total</TableCell>
                                        <TableCell align="center">₹ {parseFloat(response?.data?.data?.total_orders?.total_amount)?.toFixed(2)}</TableCell>
                                        {props.isReadOnly && <TableCell align="center"></TableCell>}
                                        {props.isReadOnly && <TableCell align="center"></TableCell>}
                                    </TableRow>

                                </TableBody>




                            </Table>
                        </TableContainer>
                    </DialogContent>
                </Box>

            </Dialog>
        </Box>
    )
}

export default CustomerLogsModal