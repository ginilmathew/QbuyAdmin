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
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
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

    rate: string,

};
type IFormInput = {
    rate: string,
}
type RateCardItem = {
    rate: string;
    
  };
  
const RateCardTab = ({ res, view, handleClose, open }: props) => {

    const idd = res ? res : view;
    const [ratePerOrder, setRatePerOrder] = useState('');
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/ratecard/list/${res}`, fetcher);
    const [pending, startTransition] = useTransition();
    const [loading, setLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ratecardData, setRateCardData] = useState<RateCardItem[]>([]);
    const currentRate = ratecardData[0]?.rate;



    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue,
    } = useForm({
        defaultValues: {
            rate: '',
        },
    });



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


    const Submit = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                rider_id: idd,
                rate: data.rate,
            };
            const response = await postData('admin/rider-support/ratecard/create', payload);
            console.log({ response })
            reset();
            handleClose()
            setIsDialogOpen(false);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };


    return (
        <Box px={5} py={2} pt={1} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='' onClick={() => null} />
                <Grid container>
                    <Grid item xs={6} lg={3}>
                        <CustomInput
                            type=''
                            control={control}
                            fieldName="Current Rate Per Order"
                            placeholder={currentRate}
                            fieldLabel={"Current Rate Per Order"}
                            disabled={false}
                            view={view ? true : false}
                        />
                    </Grid>
                </Grid>



                <Box p={.5} >
                    <CustomTable dashboard={false} columns={columns} rows={ratecardData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
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
                maxWidth='sm'
                fullWidth
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
                            {/* <Box
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
                                <HighlightOffIcon style={{ color: 'white', fontSize: 16 }} /></Box> */}
                        </Box>
                    </Box>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} lg={12}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.rate}
                                    fieldName="Rate Per Order"
                                    placeholder=""
                                    fieldLabel="Rate Per Order"
                                    disabled={false}
                                    defaultValue=""
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
