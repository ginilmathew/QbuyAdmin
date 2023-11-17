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
import { postData } from '@/CustomAxios';
import AmountSettlementModal from './AmountSettlements';
import RiderLogsModal from './RiderLogModal';
import CustomDatePicker from '@/components/CustomDatePicker';


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

    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false);
    //const [vendorSingleList, setVendorSinglelist] = useState<any>(null);
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
    const [RiderEarningList, setRiderEarninglist] = useState<any>(null);
    console.log({ RiderSingleList }, 'PP')
    const commonDateLabel = 'Date Filter';
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [fromDates, setFromDates] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [toDates, setToDates] = useState<Date | null>(null);
    const [accountData, setAccountData] = useState([]);
    const [accountDatas, setAccountDatas] = useState([]);
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

        });

    const columns: GridColDef[] = [

        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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

        },
        {
            field: 'deduction',
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
            field: 'transaction_date',
            headerName: 'Date and Time of Transaction',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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


    const OpenAccountModal = useCallback(() => {
        setOpen(true)
    }, [open])



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

 
    //     if (RiderSingleList) {
    //         const formattedData = RiderSingleList.rider_earning_list.map((earning: any, index: number) => ({
    //             id: index + 1,
    //             date: moment(earning?.date).format('DD-MM-YYYY'),
    //             total_sales: earning?.total_sales,
    //             total_sales_amount: earning?.total_sales_amount,
    //             deduction: earning?.deduction,
    //             payout: earning?.payout,
    //             status: earning?.status,
    //         }));
    //         const data = RiderSingleList.rider_earning_list;
    //         setAccountData(formattedData);

    //         const settlementData = RiderSingleList.settlement_list.map((settlement: any, index: number) => ({
    //             id: index + 1,
    //             transaction_date: moment(settlement?.transaction_date).format('DD-MM-YYYY'),
    //             amount: settlement?.amount,
    //             payment_mode: settlement?.payment_mode,
    //             transaction_id: settlement?.transaction_id,
    //         }));

    //         setAccountData(settlementData);

    //         setValue('name', RiderSingleList?.name);
    //         setValue('mobile', RiderSingleList?.mobile);
    //         setValue('franchise', RiderSingleList?.primary_franchise?.franchise_name);
    //     }
    // }, [RiderSingleList]);
    useEffect(() => {
        if (RiderSingleList && RiderSingleList.rider_earning_list) {
            const formattedData = RiderSingleList.rider_earning_list.map((earning: any, index: number) => ({
                id: index + 1,
                date: moment(earning?.date).format('DD-MM-YYYY'),
                total_sales: earning?.total_sales,
                total_sales_amount: earning?.total_sales_amount,
                deduction: earning?.deduction,
                payout: earning?.payout,
                status: earning?.status,
            }));
            setAccountData(formattedData);
        }

        if (RiderSingleList && RiderSingleList.settlement_list) {
            const settlementData = RiderSingleList.settlement_list.map((settlement: any, index: number) => ({
                id: index + 1,
                transaction_date: moment(settlement?.transaction_date).format('DD-MM-YYYY'),
                amount: settlement?.amount,
                payment_mode: settlement?.payment_mode,
                transaction_id: settlement?.transaction_id,
            }));
            setAccountDatas(settlementData);
        }

        setValue('name', RiderSingleList?.name);
        setValue('mobile', RiderSingleList?.mobile);
        setValue('franchise', RiderSingleList?.primary_franchise?.franchise_name);
    }, [RiderSingleList]);

//Settlement filter
    const fetchFilteredDatasettlement = async () => {
        const formattedFromDate = moment(fromDates).format('YYYY-MM-DD');
        const formattedToDate = moment(toDates).format('YYYY-MM-DD');
        const payload = {
            rider_id: idd,
            from_date: formattedFromDate,
            to_date: formattedToDate,
        };
        try {
            const response = await postData('admin/rider-account/rider-settlement/list', payload);
            if (response.data && response.data.data) {
                const settlementData = response.data.data.map((settlement: any, index: number) => ({
                    id: index + 1,
                    transaction_date: moment(settlement?.transaction_date).format('DD-MM-YYYY'),
                    amount: settlement?.amount,
                    payment_mode: settlement?.payment_mode,
                    transaction_id: settlement?.transaction_id,
                }));
                setAccountDatas(settlementData);
            }
        } catch (error) {
            toast.error('Failed to filter data.');
        }
    };
    useEffect(() => {
        if (fromDates && toDates) {
            fetchFilteredDatasettlement();
        }
    }, [fromDates, toDates]);


    const fetchFilteredData = async () => {
        const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
        const formattedToDate = moment(toDate).format('YYYY-MM-DD');
        const payload = {
            rider_id: idd,
            from_date: formattedFromDate,
            to_date: formattedToDate,
        };
        try {
            const response = await postData('admin/rider-account/rider-earning/list', payload);
            if (response.data && response.data.data) {
                const earningData = response.data.data.map((earning: any, index: number) => ({
                    id: index + 1,
                    date: moment(earning?.date).format('DD-MM-YYYY'),
                    total_sales: earning?.total_sales,
                    total_sales_amount: earning?.total_sales_amount,
                    deduction: earning?.deduction,
                    payout: earning?.payout,
                    status: earning?.status,
                }));
                setAccountData(earningData);
            }
        } catch (error) {
            toast.error('Failed to filter data.');
        }
    };
    
    useEffect(() => {
        if (fromDate && toDate) {
            fetchFilteredData();
        }
    }, [fromDate, toDate]);


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
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Rider  Earnings'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Orders' text={RiderSingleList?.order_count} color='#1675C8' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={RiderSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Deduction' text={RiderSingleList?.deduction} color='#FF7B7B' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Payable' text={RiderSingleList?.total_outstanding} color='#2EA10C' />
                    </Grid>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" marginLeft={'149px'} mt={2}>
                        <div >
                            <CustomDatePicker
                                fieldName='fromDate'
                                control={control}
                                error={''}
                                past={false}
                                fieldLabel={commonDateLabel}
                                values={fromDate}
                                changeValue={(date) => setFromDate(date)}
                            />
                        </div>
                        <div style={{ marginTop: '22px' }}>
                            <CustomDatePicker
                                fieldName='toDate'
                                control={control}
                                error={''}
                                past={false}
                                fieldLabel={''}
                                values={toDate}
                                changeValue={(date) => setToDate(date)}
                            />
                        </div>
                    </Stack>
                </Grid>
                <Box py={2}>
                    <CustomTable dashboard={false} columns={columns} rows={accountData} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>

            <CustomBox title="Settlements">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={RiderSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Outstanding' text={RiderSingleList?.total_outstanding} color='#FF7B7B' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <Custombutton label='Settle Payment'
                            btncolor='#F71C1C'
                            onClick={OpenAccountModal}
                            endIcon={false}
                            startIcon={false}
                            IconStart={''}
                            IconEnd={''}
                            height={'48px'}
                            disabled={loading}

                        />

                    </Grid>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" marginLeft={'322px'} mt={2}>
                        <div >
                            <CustomDatePicker
                                fieldName='fromDates'
                                control={control}
                                error={''}
                                past={false}
                                fieldLabel={commonDateLabel}
                                values={fromDates}
                                changeValue={(date) => setFromDates(date)}
                            />
                        </div>
                        <div style={{ marginTop: '22px' }}>
                            <CustomDatePicker
                                fieldName='toDates'
                                past={false}
                                control={control}
                                error={''}
                                fieldLabel={''}
                                values={toDates}
                                changeValue={(date) => setToDates(date)}
                            />
                        </div>
                    </Stack>
                </Grid>
                <Box py={2}>
                    <CustomTable dashboard={false} columns={column3} rows={accountDatas} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>
            {open && <AmountSettlementModal
                onClose={onCloseAccount}
                open={open}
                price={total}
                //data={selectChecked}
                data={RiderSingleList?.rider_earning_list}
                id={idd}
                setRiderSinglelist={setRiderSinglelist}
                RiderSingleList={RiderSingleList}
                viewRider={viewRider}
                setTotal={setTotal}


            />}
            {openLog && <RiderLogsModal onClose={onCloseLogModal} open={openLog} id={idd} date={dateSelect} />}
        </Box>
    )
}

export default RiderAccountsform