import { Avatar, Box, Grid, MenuItem, Typography, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomBox from '../CustomBox';
import { fetchData } from '@/CustomAxios';
import CustomInput from '@/components/CustomInput';
import CustomMultiselect from '@/components/CustomMultiselect';
import { IMAGE_URL } from '@/Config';
import CustomTimepicker from '@/components/CustomTimepicker';
import moment from 'moment';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GridColDef } from '@mui/x-data-grid';
import CustomViewInput from '@/components/CustomViewInput';
import Custombutton from '@/components/Custombutton';
import AmountSettlementModal from './AmountSettlementModal';
import VendorLogsModal from './VendorLogsModal';
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';


type Inputs = {
    vendor_name: string,
    vendor_email: string,
    vendor_mobile: string,
    email: string,
    category: string,
    store_name: string,
    store_address: string,
    franchise: string,
    category_id: any,
    start_time: any,
    end_time: any
}
type props = {
    idd: any;
}

const VendorAccountsForm = ({ idd }: props) => {

    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false);
    const [vendorSingleList, setVendorSinglelist] = useState<any>(null);
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [getcategory, setGetCategory] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openLog, setOpenLog] = useState<boolean>(false)
    const [vendorEarningList, setvendorEarningList] = useState<any>(null)
    const [vendorSettlementList, setVendorsettlementlist] = useState<any>([])
    const [selectChecked, setSelectChecked] = useState<any>([])
    const [total, setTotal] = useState<any>(null);
    const [dateSelect, setdateSelect] = useState<string>('')
    const [checkedValue, setcheckedvalue] = useState<any>(false)




    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.date).format('DD-MM-YYYY')

        },
        {
            field: 'total_sales',
            headerName: 'Total Sales',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'total_sales_amount',
            headerName: 'Sales Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (params.row.total_sales_amount).toFixed(2)

        },
        {
            field: 'Promotion Amount',
            headerName: 'Promotion Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'payout',
            headerName: 'Payout',
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
        {
            field: 'Order Log',
            headerName: 'Order Log',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                        onClick={() => OpenLogModal(row?.date)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
    ];


    const columns2: GridColDef[] = [
        {
            field: 'transaction_date',
            headerName: 'Date and Time of Transaction',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.transaction_date,"YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
        },
        {
            field: 'amount',
            headerName: 'Amount Settled',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'payment_mode',
            headerName: 'Payment Mode',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'transaction_id',
            headerName: 'Transaction ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

    ];



    const openLogView = useCallback(() => {
        setOpenLog(true)
    }, [])

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



            }
        });


    const onCloseAccount = useCallback(() => {
        setOpen(false)

        viewVendor()
    }, [open])


    const OpenAccountModal = useCallback(() => {
        setOpen(true)
    }, [open])

    const onCloseLogModal = useCallback(() => {
        setOpenLog(false)
        setdateSelect('')
    }, [openLog])


    const OpenLogModal = useCallback((data: any) => {
        setdateSelect(data)
        setOpenLog(true)
    }, [openLog])


    const viewVendor = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetchData(`admin/account/vendors/show/${idd}`);
            setVendorSinglelist(res?.data?.data)
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
        }
    }, [idd])

    const getCategoryList = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`/admin/category/list/${process.env.NEXT_PUBLIC_TYPE}`)
           
            setGetCategory(response?.data?.data)
            setLoading(false)

        } catch (err: any) {
            toast.error(err)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }

    }



    useEffect(() => {
        let array = vendorSingleList?.category_id?.map((res: any) => res?.id)
        if (vendorSingleList && array) {
            setValue('vendor_name', vendorSingleList?.vendor_name);
            setValue('vendor_email', vendorSingleList?.vendor_email);
            setValue('vendor_mobile', vendorSingleList?.vendor_mobile);
            setValue('store_name', vendorSingleList?.store_name);
            setValue('category_id', vendorSingleList?.category_id)
            setMultipleArray(array);
            setValue('store_address', vendorSingleList?.store_address);
            setValue('franchise', vendorSingleList?.franchise?.franchise_name);
            setValue('start_time', vendorSingleList?.start_time ? vendorSingleList?.start_time : '');
            setValue('end_time', vendorSingleList?.end_time ? vendorSingleList?.end_time : '')

        }
    }, [vendorSingleList])




    useEffect(() => {
        if (idd) {
            viewVendor();
            getCategoryList();
        }
    }, [idd])



    useEffect(() => {
        if (vendorSingleList) {
            let result = vendorSingleList?.vendor_earning_list?.map((res: any, i: number) => ({
                _id: i,
                ...res
            }))
            setvendorEarningList(result);
        }

    }, [vendorSingleList, open])


    useEffect(() => {
        if (vendorSingleList) {
            let result = vendorSingleList?.settlement_list?.map((res: any, i: number) => ({
                _id: i,
                ...res
            }))
            setVendorsettlementlist(result)
        }

    }, [vendorSingleList])



    const vendorEarningSelect = (item: any) => {
        let result = vendorEarningList?.filter((res: any) => item?.includes(res?._id))
        let totalPrice = result.reduce((accumulator: any, total: any) => accumulator + parseInt(total.payout), 0);
        setSelectChecked(result)
        setTotal(totalPrice)
    }


    if (!vendorSingleList) {
        return <><Spinner /></>
    }

    return (
        <Box>
            <CustomBox title='vendor Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_name}
                            fieldName="vendor_name"
                            placeholder={``}
                            fieldLabel={"Vendor Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_email}
                            fieldName="vendor_email"
                            placeholder={``}
                            fieldLabel={"Vendor Email"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.vendor_mobile}
                            fieldName="vendor_mobile"
                            placeholder={``}
                            fieldLabel={"Vendor Mobile"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Store Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.store_name}
                            fieldName="store_name"
                            placeholder={``}
                            fieldLabel={"Store Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.store_address}
                            fieldName="store_address"
                            placeholder={``}
                            fieldLabel={"Address"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise}
                            fieldName="franchise"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomMultiselect
                            multiple={true}
                            control={control}
                            error={errors.category_id}
                            fieldName="category_id"
                            placeholder={``}
                            fieldLabel={"Category"}
                            readOnly={false}
                            value={multpleArray}
                            onChangeValue={() => null}
                            type=''
                        >
                            <MenuItem value="" disabled >
                                <>Select Category</>
                            </MenuItem>
                            {getcategory && getcategory.map((res: any) => (
                                <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                            ))}
                        </CustomMultiselect>

                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.start_time}
                            fieldName="start_time"
                            placeholder={``}
                            fieldLabel={"Store Time"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.end_time}
                            fieldName="end_time"
                            placeholder={``}
                            fieldLabel={""}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />

                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Typography>Store Logo/Image</Typography>
                        <Avatar variant='square' src={`${IMAGE_URL}${vendorSingleList?.original_store_logo}`} sx={{ width: '100%', height: 130 }} />
                    </Grid>
                </Grid>

            </CustomBox>
            <CustomBox title='Vendor  Earnings'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Orders' text={vendorSingleList?.order_count} color='#1675C8' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={vendorSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Promotion Cost' text={vendorSingleList?.promotion_cost} color='#FF7B7B' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Payable' text={vendorSingleList?.total_outstanding} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <Custombutton label='Settle Payment'
                            btncolor='#F71C1C'
                            onClick={OpenAccountModal}
                            endIcon={false}
                            startIcon={false}
                            IconStart={undefined}
                            IconEnd={undefined}
                            height={undefined}
                            disabled={(vendorEarningList && total) ? false : true}

                        />
                    </Grid>
                </Grid>
                <Box py={3}>
                    <CustomTable
                        dashboard={false}
                        columns={columns}
                        rows={vendorEarningList ? vendorEarningList : []}
                        id={"_id"}
                        bg={"#ffff"}
                        label='Recent Activity'
                        checked={true}

                        selectCheck={(itm: any) => vendorEarningSelect(itm)}
                    />
                </Box>
            </CustomBox>
            <CustomBox title="Settlements">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={vendorSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Outstanding' text={vendorSingleList?.total_outstanding} color='#FF7B7B' />
                    </Grid>
                </Grid>
                <Box py={2}>
                    <CustomTable dashboard={false} columns={columns2} rows={vendorSettlementList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>

            {open && <AmountSettlementModal
                onClose={onCloseAccount}
                open={open}
                price={total}
                data={selectChecked}
                id={idd}
                setVendorSinglelist={setVendorSinglelist}
                viewVendor={viewVendor}
                setTotal={setTotal}


            />}
            {openLog && <VendorLogsModal onClose={onCloseLogModal} open={openLog} id={idd} date={dateSelect} />}
        </Box>
    )
}

export default VendorAccountsForm