import { Box, Grid, MenuItem, Typography, Stack, DialogContent } from "@mui/material";
import React, {
    startTransition,
    useCallback,
    useState,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import CustomTable from '@/components/CustomTable';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import CustomBox from "../CustomBox";
import CustomInput from "@/components/CustomInput";
import Customselect from "@/components/Customselect";
import CustomCheckBox from "@/components/CustomCheckBox";
import Custombutton from "@/components/Custombutton";
import { fetchData, postData } from "@/CustomAxios";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import moment from 'moment';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';
import { GridColDef } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const CustomDatePicker = dynamic(() => import('@/components/CustomDatePicker'), { ssr: false });

type Inputs = {
    order_id: string;
    name: string;
    email: string;
    mobile: string;
    created_at: string;
    address: string;
    addresss: string;
    comments: string;
    ridername: string;
    ridermobile: string;
    payment_type: string;
    payment_status: string;
    created_time: string;
    created_ontheway: string;
    created_dropoff: string;
    created_completed: string;
    customer_group: string;
};



type props = {
    resData?: any;
    view?: any;
    readonly?: any;
};

interface Product {
    name: string;
    store_name: string;
    unitPrice: number;
    quantity: number;
}

interface VendorOrderLogEntry {
    created_time: string;
    order_id: string;
    status: string;
    updated_at: string;
    vendor_id: string;

}
interface LogEntry {
    created_ontheway: string;
    order_id: string;
    status: string;
    updated_at: string;
}
// interface OrderHistoryEntry {
//     created_completed: string;
//     order_history_id: number;
//     order_id: string;
//     status: string;
//     comments: string;

// }
interface VendorStatus {
    status: string;
    store_name: string;
    vendor_id: string;
    vendor_name: string;
}


const OrderSummaryForm = ({ resData, view,readonly }: props) => {
    const idd = resData ? resData : view;

    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const router = useRouter();
    const [categoryList, setCategoryList] = useState<any>([]);
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [selectedFranchiseName, setSelectedFranchiseName] = useState("");
    const [statusSelect, setStatusSelect] = useState<any>(null)
    const [instantBlock, setInstantBlock] = useState<boolean>(false);
    const [notificationBlock, setNotificationBlock] = useState<boolean>(false);
    const [summaryList, setSummaryList] = useState<any>([]);
    console.log({ summaryList }, "listdply")
    const [customerName, setCustomerName] = useState("");
    const [time, setTime] = useState<any>(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [pendingOrderTime, setPendingOrderTime] = useState("");
    const [onTheWayTime, setOnTheWayTime] = useState("");
    const [onLocationTime, setOnLocationTime] = useState("");
    const [completedTime, setCompletedTime] = useState("");



    const columns: GridColDef[] = [
        {
            field: 'created_at',
            headerName: 'Date Added',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format('DD-MM-YYYY')

        },
        {
            field: 'comments',
            headerName: 'Comments',
            flex: 1,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
    ];


    const schema = yup.object().shape({

    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue, setError, clearErrors } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: {

        }
    });



    const orderview = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/order-summary/show/${idd}`);
            console.log(response.data.data);
            setSummaryList(response?.data?.data);

            const vendorLog = response?.data?.data?.vendor_order_log;
            if (vendorLog && vendorLog.length > 0) {
                const pendingOrder = vendorLog.find((log: VendorOrderLogEntry) => log.status === "pending");
                if (pendingOrder) {
                    const timeOnly = moment(pendingOrder.created_at).format('hh:mm A');

                    setPendingOrderTime(timeOnly);
                    setValue('created_time', timeOnly);
                }
            }
            const riderOrderLog = response?.data?.data?.rider_order_log;
            if (riderOrderLog && riderOrderLog.length > 0) {
                const onTheWayOrder = riderOrderLog.find((log: LogEntry) => log.status === "onTheWay");
                if (onTheWayOrder) {
                    const timeOnly = moment(onTheWayOrder.created_at).format('hh:mm A');
                    setOnTheWayTime(timeOnly);
                    setValue('created_ontheway', timeOnly);
                }
            }

            if (riderOrderLog && riderOrderLog.length > 0) {
                const onLocationOrder = riderOrderLog.find((log: LogEntry) => log.status === "onLocation");
                if (onLocationOrder) {
                    const timeOnly = moment(onLocationOrder.created_at).format('hh:mm A');
                    setOnLocationTime(timeOnly);
                    setValue('created_dropoff', timeOnly);
                }
            }
            // const orderHistory = response?.data?.data?.order_history;
            // if (orderHistory && orderHistory.length > 0) {
            //     const completedOrder = orderHistory.find((entry: OrderHistoryEntry) => entry.status === "completed");
            //     if (completedOrder) {
            //         const timeOnly = moment(completedOrder.created_at).format('hh:mm A');
            //         setCompletedTime(timeOnly);
            //         setValue('created_completed', timeOnly);
            //     }
            // }

        } catch (err: any) {
            toast.error(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idd) {
            orderview();
        }
    }, [idd]);

    useEffect(() => {
        if (summaryList) {
            if (summaryList?.billaddress?.name) {
                const formattedDate = moment(summaryList?.created_at).format('DD/MM/YYYY hh:mm A');
                setValue('name', summaryList?.billaddress?.name);
                setValue('mobile', summaryList?.billaddress?.mobile);
                setValue('order_id', summaryList?.order_id);
                // setValue('created_at', summaryList?.created_at);
                setValue('created_at', formattedDate);
                setValue('address', summaryList?.billaddress?.area?.address);
                setValue('addresss', summaryList?.shipaddress?.area?.address);
                setValue('comments', summaryList?.billaddress?.comments);
                setValue('ridername', summaryList?.rider_each_order_settlement?.rider?.name)
                setValue('ridermobile', summaryList?.rider_each_order_settlement?.rider?.mobile)
                setValue('payment_type', summaryList?.payment_type)
                setValue('payment_status', summaryList?.payment_status)
                const customerGroupName = summaryList.user?.customer?.customer_group?.name || '';
                setValue('customer_group', customerGroupName);
                // const deliveryTime = moment(summaryList.order_delivery_time).format('hh:mm A');
                // setValue('created_completed', deliveryTime);
                if (summaryList.order_delivery_time !== null) {
                    const deliveryTime = moment(summaryList.order_delivery_time).format('hh:mm A');
                    setValue('created_completed', deliveryTime);
                } else {
                    setValue('created_completed', '');
                }
            }
            if (summaryList.order_history) {
                setOrderHistory(summaryList.order_history);
            }

        }
    }, [summaryList, setValue]);





    return (
        <Box>
            <CustomBox title="Customer Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={view ? true : false}


                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Email address"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid> */}
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.customer_group}
                            fieldName="customer_group"
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={summaryList.user?.customer?.customer_group?.name || ''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>

            <CustomBox title="Order Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="order_id"
                            placeholder={``}
                            fieldLabel={"Order ID"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="created_at"
                            placeholder={``}
                            fieldLabel="Ordered Date & Time"
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>



                    <Grid item xs={12} lg={6} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="address"
                            placeholder={``}
                            fieldLabel={"Payment Address or Pickup Address"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="addresss"
                            placeholder={``}
                            fieldLabel={"Shipping Address or Delivery Address"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title="">
                <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="center">Restaurant</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Unit Price</TableCell>
                                <TableCell align="center">Total Price</TableCell>
                                {<TableCell align="center"></TableCell>}
                                {<TableCell align="center"></TableCell>}
                                {<TableCell align="center"></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {summaryList?.product_details?.map((row: any) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row?.name},{row?.attributes}
                                        
                                    </TableCell>
                                   

                            
                                    <TableCell align="center">{row?.productdata?.store?.name}</TableCell>

                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">{(row?.unitPrice)}</TableCell>
                                    <TableCell align="center">{(row?.quantity * row?.unitPrice).toFixed(2)}</TableCell>
                                  


                                </TableRow>
                            ))}
                            <TableRow >
                                <TableCell rowSpan={5} />
                                <TableCell colSpan={2}></TableCell>
                                <TableCell align="right">Sub-Total</TableCell>
                                <TableCell align="center">₹ {parseFloat(summaryList?.total_amount)?.toFixed(2)}</TableCell>
                                {readonly && <TableCell align="center"></TableCell>}
                                {readonly && <TableCell align="center"></TableCell>}
                            </TableRow>

                            <TableRow>

                                <TableCell colSpan={2}></TableCell>
                                <TableCell align="right" >Delivery Charge (SlotBased)</TableCell>
                                <TableCell align="center">₹ {summaryList?.delivery_charge}</TableCell>
                                
                             
                            </TableRow>


                            <TableRow>
                                <TableCell colSpan={2}></TableCell>
                                <TableCell align="right">Platform Charge</TableCell>
                                <TableCell align="center">
                                    ₹ {isNaN(summaryList?.platform_charge) ? 'Nil' : parseFloat(summaryList?.platform_charge).toFixed(2)}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}></TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="center">₹ {parseFloat(summaryList?.grand_total)?.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            </CustomBox>

            <CustomBox title="">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="comments"
                            placeholder={``}
                            fieldLabel={"Customer Instructions"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title="Rider Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="ridername"
                            placeholder={``}
                            fieldLabel={"Rider Name"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Email address"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid> */}
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="ridermobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Critical Time"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid> */}
                </Grid>
            </CustomBox>
            <CustomBox title="Order Timings">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="created_time"
                            placeholder={``}
                            fieldLabel={"Store Accepted On"}
                            disabled={false}
                            view={view ? true : false}

                        />

                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="created_ontheway"
                            placeholder={``}
                            fieldLabel={"Reached Store"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="created_ontheway"
                            placeholder={``}
                            fieldLabel={"Pickup Time"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="created_dropoff"
                            placeholder={``}
                            fieldLabel={"Reached Dropoff"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={onLocationTime}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="created_completed"
                            placeholder={``}
                            fieldLabel={"Delivery Time"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title="Payment Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="payment_type"
                            placeholder={``}
                            fieldLabel={"Payment Method"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="payment_status"
                            placeholder={``}
                            fieldLabel={"Payment Status"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    {/* <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Invoice No."}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Reward Points Received"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid> */}
                </Grid>
            </CustomBox>
            {/* <CustomBox title="Customer Feedbacks">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="title"
                            placeholder={``}
                            fieldLabel={"Ratings Given"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={6} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Feedback"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                </Grid>
            </CustomBox> */}
            <CustomBox title="Order History">
                <CustomTable
                    dashboard={false}
                    columns={columns}
                    rows={orderHistory}
                    id={"_id"}
                    bg={"#ffff"}
                    label='Recent Activity'
                />
            </CustomBox>

        </Box>
    );
};

export default OrderSummaryForm;
