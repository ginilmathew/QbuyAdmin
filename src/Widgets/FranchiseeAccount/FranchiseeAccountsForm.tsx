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
import AmountSettlementFranchiseeModal from './AmountSettlements';
import RiderLogsModalFranchisee from './RiderLogModal';
import CustomDatePicker from '@/components/CustomDatePicker';


type Inputs = {
    franchise_name: string,
    owner_name: string,
    email: string,
    mobile: string,
    address: string,
};

type props = {
    res?: any,
    view?: any,
    id?: any;
};
const FranchiseeAccountsform = ({ view, res }: props) => {
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
    const [FranchiseeSingleList, setFranchiseeSinglelist] = useState<any>(null);
    const commonDateLabel = 'Date Filter';
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [fromDates, setFromDates] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [toDates, setToDates] = useState<Date | null>(null);
    const [franchiseeData, setFranchiseeData] = useState([]);
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
            field: 'total_store',
            headerName: 'Total Stores',
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



    const viewFranchisee = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetchData(`admin/account/franchise/show/${idd}`);
            setFranchiseeSinglelist(res?.data?.data)
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
        }
    }, [idd])

    useEffect(() => {
        if (idd) {
            viewFranchisee();

        }
    }, [idd])



    useEffect(() => {
        if (FranchiseeSingleList && Array.isArray(FranchiseeSingleList?.franchise_earning_list)) {

            const formattedData = FranchiseeSingleList?.franchise_earning_list?.map((earning: any, index: number) => ({

                id: index + 1,
                date: moment(earning?.date).format('DD-MM-YYYY'),
                total_store: earning?.total_store,
                total_sales: earning?.total_sales,
                total_sales_amount: earning?.total_sales_amount,
                payout: earning?.payout,
                status: earning?.status,
            }));
            setFranchiseeData(formattedData);
            console.log('Formatted franchise_earning_list:', formattedData);
        }

        if (FranchiseeSingleList && FranchiseeSingleList.settlement_list) {
            const settlementData = FranchiseeSingleList.settlement_list.map((settlement: any, index: number) => ({
                id: index + 1,
                transaction_date: moment(settlement?.transaction_date).format('DD-MM-YYYY'),
                amount: settlement?.amount,
                payment_mode: settlement?.payment_mode,
                transaction_id: settlement?.transaction_id,
            }));
            setAccountDatas(settlementData);
        }

        setValue('franchise_name', FranchiseeSingleList?.franchise_name);
        setValue('owner_name', FranchiseeSingleList?.owner_name);
        setValue('email', FranchiseeSingleList?.email);
        setValue('mobile', FranchiseeSingleList?.mobile);
        setValue('email', FranchiseeSingleList?.email);
        setValue('address', FranchiseeSingleList?.address);
    }, [FranchiseeSingleList]);

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
                setFranchiseeData(earningData);
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

        viewFranchisee()
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
            <CustomBox title='Franchisee Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise_name}
                            fieldName="franchise_name"
                            placeholder={``}
                            fieldLabel="Franchisee Name"
                            disabled={true}
                            view={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.owner_name}
                            fieldName="owner_name"
                            placeholder={``}
                            fieldLabel={"Owner Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
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
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.address}
                            fieldName="address"
                            placeholder={``}
                            fieldLabel={"Address"}
                            disabled={false}
                            view={true}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Franchisee  Earnings'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Orders' text={FranchiseeSingleList?.order_count} color='#1675C8' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={FranchiseeSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Promotion Cost' text={FranchiseeSingleList?.promotion_cost} color='#FF7B7B' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Payable' text={FranchiseeSingleList?.total_payable} color='#2EA10C' />
                    </Grid>
                    <Stack direction="row" spacing={2}  mt={2} marginLeft={'85px'}>
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
                        <div style={{ marginTop: '24px' }}>
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
                    <CustomTable dashboard={false} columns={columns} rows={franchiseeData} id={"_id"} bg={"#ffff"} label='Recent Activity' />

                </Box>
            </CustomBox>

            <CustomBox title="Settlements">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={FranchiseeSingleList?.total_earnings} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Outstanding' text={FranchiseeSingleList?.total_outstanding} color='#FF7B7B' />
                    </Grid>
                    <Grid item direction="row-reverse">
                        <Typography mb={3}></Typography>
                        <Custombutton label='Settle Payment'
                            btncolor='#F71C1C'
                            onClick={OpenAccountModal}
                            endIcon={false}
                            startIcon={false}
                            IconStart={''}
                            IconEnd={''}
                            height={'42px'}
                            disabled={loading}

                        />

                    </Grid>



                   
                    <Stack direction="row" spacing={2}  mt={2} marginLeft={'220px'}>
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
                        <div style={{ marginTop: '24px' }}>
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
            {open && <AmountSettlementFranchiseeModal
                onClose={onCloseAccount}
                open={open}
                price={total}
                //data={selectChecked}
                data={FranchiseeSingleList?.rider_earning_list}
                id={idd}
                setFranchiseeSinglelist={setFranchiseeSinglelist}
                RiderSingleList={FranchiseeSingleList}
                viewFranchisee={viewFranchisee}
                setTotal={setTotal}


            />}
            {openLog && <RiderLogsModalFranchisee onClose={onCloseLogModal} open={openLog} id={idd} date={dateSelect} />}
        </Box>
    )
}

export default FranchiseeAccountsform