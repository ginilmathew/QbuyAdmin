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

    const [loading, setLoading] = useState<boolean>(false);
    const [vendorSingleList, setVendorSinglelist] = useState<any>(null);
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [getcategory, setGetCategory] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openLog, setOpenLog] = useState<boolean>(false)
    console.log({ vendorSingleList })



    const columns: GridColDef[] = [
        {
            field: 'Date',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Total Sales',
            headerName: 'Total Sales',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Sales Amount',
            headerName: 'Sales Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Promotion Amount',
            headerName: 'Promotion Amount',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Payout',
            headerName: 'Payout',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Status',
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
                        onClick={openLogView}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
    ];




  

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
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
    }, [open])


    const OpenAccountModal = useCallback(() => {
        setOpen(true)
    }, [open])

    const onCloseLogModal = useCallback(() => {
        setOpenLog(false)
    }, [openLog])


    const OpenLogModal = useCallback(() => {
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
            console.log({ response })
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
            setValue('start_time', vendorSingleList?.start_time);
            setValue('end_time', vendorSingleList?.end_time)

        }
    }, [vendorSingleList])




    useEffect(() => {
        if (idd) {
            viewVendor();
            getCategoryList();
        }
    }, [idd])

    if (!vendorSingleList) {
        return <>Loading...</>
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
                        <CustomViewInput fieldLabel='Promotion Coast' text={vendorSingleList?.promotion_cost} color='#FF7B7B' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <CustomViewInput fieldLabel='Total Payable' text={vendorSingleList?.total_payable} color='#2EA10C' />
                    </Grid>
                    <Grid item xs={12} lg={1.5}>
                        <Typography mb={3}></Typography>
                        <Custombutton label='Settle Payment' btncolor='#F71C1C' onClick={OpenAccountModal} endIcon={false} startIcon={false} IconStart={undefined} IconEnd={undefined} height={undefined} />
                    </Grid>
                </Grid>
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' checked={true} />
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
                    <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>

            <AmountSettlementModal onClose={onCloseAccount} open={open} selectedValue='' />
            <VendorLogsModal onClose={onCloseLogModal} open={openLog} />
        </Box>
    )
}

export default VendorAccountsForm