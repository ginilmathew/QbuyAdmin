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
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';
import AmountSettlementModal from './AmountSettlements';
import RiderLogsModal from './RiderLogModal';


type Inputs = {
    name: string,
    mobile: string,
    email: string,
    franchise: string,
};

type props = {
    res?: any,
    view?: any,
    id?: any;
};
const RiderAccountsform = ({ view, res }: props) => {
    const idd = view ? view : res;
    console.log(idd);
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
    const [RiderSingleList, setRiderSinglelist] = useState<any>(null);
    console.log({ RiderSingleList }, 'PP')




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
            headerName: 'Deductions',
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
    const column2: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.date).format('DD-MM-YYYY')

        },
        {
            field: 'amount',
            headerName: 'Deduction Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'payment_mode',
            headerName: 'Reason',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
    ];

    const column3: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date and Time of Transaction',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.date).format('DD-MM-YYYY')

        },
        {
            field: 'amount',
            headerName: 'Amount settled',
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
                name: RiderSingleList?.name || '', // Set default value from API response
                mobile: RiderSingleList?.mobile || '', // Set default value from API response
                email: RiderSingleList?.email || '', // Set default value from API response
                franchise: '', // Add other default values here
            },
        });

    const OpenAccountModal = useCallback(() => {
        setOpen(true)
    }, [open])



    const vendorEarningSelect = (item: any) => {
        let result = vendorEarningList?.filter((res: any) => item?.includes(res?._id))
        let totalPrice = result.reduce((accumulator: any, total: any) => accumulator + parseInt(total.payout), 0);
        setSelectChecked(result)
        setTotal(totalPrice)
    }

    const viewRider = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetchData(`admin/rider-account/show/${idd}`);
            setRiderSinglelist(res?.data?.data)
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
        }
    }, [idd])


    useEffect(() => {
        if (idd) {
            viewRider();

        }
    }, [idd])


    const onCloseAccount = useCallback(() => {
        setOpen(false)

        viewRider()
    }, [open])


    const onCloseLogModal = useCallback(() => {
        setOpenLog(false)
        setdateSelect('')
    }, [openLog])


    const OpenLogModal = useCallback((data: any) => {
        setdateSelect(data)
        setOpenLog(true)
    }, [openLog])

    // if (!RiderSingleList) {
    //     return <><Spinner /></>
    // }

    return (
        <Box>
            <CustomBox title='Rider Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel="Rider Name"
                            disabled={true}
                            view={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="email"
                            placeholder={``}
                            fieldLabel={"Email Address"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
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
                            fieldLabel={"Franchisee"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Rider  Earnings'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Orders' text={vendorSingleList?.order_count} color='#1675C8' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={vendorSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Deduction' text={vendorSingleList?.promotion_cost} color='#FF7B7B' />
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
            <CustomBox title='Deductions'>

                <Box py={3}>
                    <CustomTable
                        dashboard={false}
                        columns={column2}
                        rows={vendorEarningList ? vendorEarningList : []}
                        id={"_id"}
                        bg={"#ffff"}
                        label='Recent Activity'
                        checked={true}


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
                    <CustomTable dashboard={false} columns={column3} rows={vendorSettlementList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>
            {open && <AmountSettlementModal
                onClose={onCloseAccount}
                open={open}
                price={total}
                data={selectChecked}
                id={idd}
                setVendorSinglelist={setVendorSinglelist}
                viewRider={viewRider}
                setTotal={setTotal}


            />}
            {openLog && <RiderLogsModal onClose={onCloseLogModal} open={openLog} id={idd} date={dateSelect} />}
        </Box>
    )
}

export default RiderAccountsform