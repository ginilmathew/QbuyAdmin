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
    const [vendorSingleList, setVendorSinglelist] = useState<any>(null);
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [getcategory, setGetCategory] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openLog, setOpenLog] = useState<boolean>(false)
    const [franchiseeEarningList, setfranchiseeEarningList] = useState<any>(null)
    const [franchiseeSettlementList, setFranchisesettlementlist] = useState<any>([])
    const [selectChecked, setSelectChecked] = useState<any>([])
    const [total, setTotal] = useState<any>(null);
    const [dateSelect, setdateSelect] = useState<string>('')
    const [checkedValue, setcheckedvalue] = useState<any>(false)
    const [FranchiseeSingleList, setFranchiseeSinglelist] = useState<any>(null);
    console.log({FranchiseeSingleList},'oooo')




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

        },
        {
            field: 'total_payout_amount',
            headerName: 'Payout',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => parseFloat(params.row.total_payout_amount).toFixed(2)

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
            valueGetter: (params) => moment(params?.row?.created_at).format("DD-MM-YYYY hh:mm A")
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

        viewFranchisee()
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
        if (FranchiseeSingleList) {
            setValue('franchise_name', FranchiseeSingleList?.franchise_name);
            setValue('owner_name', FranchiseeSingleList?.owner_name);
            setValue('email', FranchiseeSingleList?.email);
            setValue('mobile', FranchiseeSingleList?.mobile);
            setValue('address', FranchiseeSingleList?.address); 
        }
    }, [FranchiseeSingleList,open]);
    




    useEffect(() => {
        if (idd) {
            viewFranchisee();

        }
    }, [idd])



    useEffect(() => {
        if (FranchiseeSingleList) {
            let result = FranchiseeSingleList?.franchise_earning_list?.map((res: any, i: number) => ({
                _id: i,
                ...res
            }))
            setfranchiseeEarningList(result);
        }

    }, [FranchiseeSingleList, open])


    useEffect(() => {
        if (FranchiseeSingleList) {
            let result = FranchiseeSingleList?.settlement_list?.map((res: any, i: number) => ({
                _id: i,
                ...res
            }))

            console.log({result})
            setFranchisesettlementlist(result)
        }

    }, [FranchiseeSingleList])



    // const franchiseeEarningSelect = (item: any) => {
    //     let result = franchiseeEarningList?.filter((res: any) => item?.includes(res?._id))
    //     let totalPrice = result.reduce((accumulator: any, total: any) => accumulator + parseInt(total.total_payout_amount), 0);
    //     setSelectChecked(result)
    //     setTotal(totalPrice)
    // }
    // const franchiseeEarningSelect = (item: any) => { 
    //     let result = franchiseeEarningList?.filter((res: any) => item?.includes(res?._id)); 
    //     let totalPrice = result.reduce((accumulator: any, total: any) => {
    //         console.log('Accumulator:', accumulator);
    //         console.log('Current Total Payout Amount:', total.total_payout_amount);
    //         return accumulator + parseFloat(total.total_payout_amount); 
    //     }, 0);
    //     setSelectChecked(result);
    //     setTotal(totalPrice);
    // }
    const franchiseeEarningSelect = (item: any) => {
        let result = franchiseeEarningList?.filter((res: any) => item?.includes(res?._id));
    
        let totalPrice = result.reduce((accumulator: any, total: any) => {
            console.log('Accumulator:', accumulator);
            console.log('Current Total Payout Amount:', total.total_payout_amount);
            return accumulator + parseFloat(total.total_payout_amount);
        }, 0);
    
        let roundedTotalPrice = totalPrice.toFixed(2);
        let finalTotalPrice = parseFloat(roundedTotalPrice);
    
        console.log('Total Price:', finalTotalPrice);
    
        setSelectChecked(result);
        setTotal(finalTotalPrice);
    }
    

    if (!FranchiseeSingleList) {
        return <><Spinner /></>
    }

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
                            fieldLabel={"Franchisee Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
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
                        <CustomViewInput fieldLabel='Total Earnings' text={FranchiseeSingleList?.total_earnings.toFixed(2)} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Promotion Cost' text={FranchiseeSingleList?.promotion_cost} color='#FF7B7B' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Payable'  text={FranchiseeSingleList?.total_outstanding.toFixed(2)} color='#2EA10C' />
                    </Grid>
                    <Grid item direction="row-reverse">
                        <Typography mb={3}></Typography>
                        <Custombutton label='Settle Payment'
                            btncolor='#F71C1C'
                            onClick={OpenAccountModal}
                            endIcon={false}
                            startIcon={false}
                            IconStart={undefined}
                            IconEnd={undefined}
                            height={'42px'}
                            disabled={(franchiseeEarningList && total) ? false : true}

                        />
                    </Grid>
                </Grid>
                <Box py={3}>
                    <CustomTable
                        dashboard={false}
                        columns={columns}
                        rows={franchiseeEarningList ? franchiseeEarningList : []}
                        id={"_id"}
                        bg={"#ffff"}
                        label='Recent Activity'
                        checked={true}

                        selectCheck={(itm: any) => franchiseeEarningSelect(itm)}
                    />
                </Box>
            </CustomBox>
            <CustomBox title="Settlements">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Earnings' text={FranchiseeSingleList?.total_earnings.toFixed(2)} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Outstanding' text={FranchiseeSingleList?.total_outstanding.toFixed(2)} color='#FF7B7B' />
                    </Grid>
                </Grid>
                <Box py={2}>
                    <CustomTable dashboard={false} columns={columns2} rows={franchiseeSettlementList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>

            {open && <AmountSettlementModal
                onClose={onCloseAccount}
                open={open}
                price={total}
                data={selectChecked}
                id={idd}
                setFranchiseeSinglelist={setFranchiseeSinglelist}
                viewFranchisee={viewFranchisee}
                FranchiseeSingleList={FranchiseeSingleList}
                setTotal={setTotal}


            />}
            {openLog && <RiderLogsModal onClose={onCloseLogModal} open={openLog} id={idd} date={dateSelect} />}
        </Box>
    )
}

export default FranchiseeAccountsform