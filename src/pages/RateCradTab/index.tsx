import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material'
import CustomInput from '@/components/CustomInput';
import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Stack } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment';
import { useRouter } from 'next/router';
import Custombutton from '@/components/Custombutton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { toast } from 'react-toastify';
import { fetchData, postData } from '@/CustomAxios';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useForm, SubmitHandler, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomLoader from '@/components/CustomLoader';

const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);

type props = {
    res?: any,
    view?: any,
    handleClose: any,
    open: boolean,
}
type Inputs = {
    rate: any,
    fromDate: Date | null,
    toDate: Date | null,
};

type IFormInput = {
    rate: any,
}
type RateCardItem = {
    rate: string;

};


const RateCardTab = ({ res, view, open }: props) => {

    const idd = res ? res : view;
    const [ratePerOrder, setRatePerOrder] = useState('');
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/ratecard/list/${res}`, fetcher);
    console.log({ data }, 'll')
    const [pending, startTransition] = useTransition();
    const [loading, setLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ratecardData, setRateCardData] = useState<RateCardItem[]>([]);
    const currentRate = ratecardData[0]?.rate;
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const commonDateLabel = 'Date Filter';


    const schema = yup.object().shape({
        rate: yup
            .string()
            .required('Rate Per Order is required')

    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue,
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            rate: '',
            fromDate: null,
            toDate: null,
        },

    }

    );
    console.log({ errors })

    const handleClose = () => {
        setIsDialogOpen(false);
        mutate()
    };

    useEffect(() => {
        if (data?.data?.data) {
            setRateCardData(data?.data?.data);
            console.log("Ratecard Data:", data?.data?.data);
        }
    }, [data?.data?.data]);



    const columns: GridColDef[] = [

        {
            field: 'created_at',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY')),
        },
        {
            field: 'rate',
            headerName: 'Rate',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
    ];

    const openModal = () => {
        setIsDialogOpen(true);
    };



    const Submit = async (formData: IFormInput) => {
        setLoading(true);
        try {
            const payload = {
                rider_id: idd,
                rate: formData.rate, 
            };
            const response = await postData('admin/rider-support/ratecard/create', payload);
            console.log({ response })

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    const submitDateRange = async () => {
        if (fromDate && toDate) {
            const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(toDate).format('YYYY-MM-DD');

            const payload = {
                from_date: formattedFromDate,
                to_date: formattedToDate,
                rider_id: idd,
            };

            setLoading(true);

            try {
                const response = await postData('/admin/rider-support/ratecard/listbasedondate', payload);
                if (response.data && Array.isArray(response.data.data)) {
                    setRateCardData(response.data.data);
                } else {
                    setRateCardData([]);
                }
            } catch (error) {
                toast.error('Failed to filter data.');
            } finally {
                setLoading(false);
            }
        } else {

        }
    };

    useEffect(() => {
        submitDateRange();
    }, [fromDate, toDate]);


    useEffect(() => {
        console.log('Rate card data has been updated:', ratecardData);
    }, [ratecardData]);

    return (
        <Box px={0} py={1} pt={1} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                {/* <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='' onClick={() => null} /> */}
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type=''
                            control={control}
                            error={''}
                            fieldName="Current Rate Per Order"
                            placeholder={currentRate}
                            fieldLabel={"Current Rate Per Order"}
                            disabled={true}
                            view={true}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6} container justifyContent="flex-end">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <div>
                                <CustomDatePicker
                                    fieldName='fromDate'
                                    control={control}
                                    error={''}
                                    fieldLabel={commonDateLabel}
                                    values={fromDate}
                                    changeValue={(date) => setFromDate(date)}
                                />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <CustomDatePicker
                                    fieldName='toDate'
                                    control={control}
                                    error={''}
                                    fieldLabel={''}
                                    values={toDate}
                                    changeValue={(date) => setToDate(date)}
                                />
                            </div>
                        </Stack>
                    </Grid>
                </Grid>



                <Box p={2} >
                    {isLoading ? (
                        <CustomLoader />
                    ) : (
                        <CustomTable dashboard={false} columns={columns} rows={ratecardData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                    )}
                </Box>

            </Box>
            <Box py={3}>
                <Custombutton
                    btncolor='red'
                    IconEnd={''}
                    IconStart={''}
                    endIcon={false}
                    startIcon={false}
                    height={''}
                    label={'Edit Rate'}
                    onClick={openModal}
                    disabled={loading}
                />
            </Box>
            <Dialog
                onClose={handleClose}
                open={isDialogOpen}
                maxWidth='md'
            //fullWidth
            >
                <Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>

                        </Box>
                        <Box>
                            <Typography sx={{
                                fontSize: {
                                    lg: 24,
                                    md: 20,
                                    sm: 16,
                                    xs: 11,
                                },
                                fontWeight: 'bold',
                                letterSpacing: 1,
                                fontFamily: `'Poppins' sans-serif`,
                            }}>{'Rate Card'}</Typography>
                        </Box>
                        <Box onClick={handleClose}>
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
                                <HighlightOffIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                        </Box>
                    </Box>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} lg={12}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.rate}
                                    fieldName="rate"
                                    placeholder=""
                                    fieldLabel="Rate Per Order"
                                    disabled={false}
                                    defaultValue=""
                                    view={false}
                                    {...register('rate')}
                                />



                            </Grid>
                        </Grid>
                        <Box py={1} display={'flex'} justifyContent={'center'}>
                            <Custombutton
                                btncolor=''
                                IconEnd={''}
                                IconStart={''}
                                endIcon={false}
                                startIcon={false}
                                height={''}
                                label={'Update'}
                                disabled={loading}
                                onClick={handleSubmit(Submit)} />
                        </Box>

                    </DialogContent>
                </Box>

            </Dialog>

        </Box>
    );
};

export default RateCardTab;
