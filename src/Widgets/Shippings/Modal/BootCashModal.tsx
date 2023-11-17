import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import Customselect from '@/components/Customselect';
import { toast } from 'react-toastify';
import { fetchData, postData } from '@/CustomAxios';
import CustomSingleSearch from '@/components/CustomSingleSearch';
import { getProduct } from '../../../helpers/productHelper/productHelper';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { constants } from 'fs';
import { FormInputs } from '@/utilities/types';


type props = {
    handleClose: any;
    open: boolean;
    cashInHandDetails: { boot_cash_limit: string };
    rider_id: { rider_id: string },
    mutate: any


}
type Inputs = {
    bootcash: any;




};

const BootCashModal = ({ handleClose, open, cashInHandDetails, rider_id, mutate }: props) => {





    const [SelectedValue, setSelectedValue] = useState<any>('');
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [bootcash, setBootCash] = useState<any>('')

    const schema = yup.object().shape({
        bootcash: yup.number().typeError("BootCash must be a number").required('BootCash is required'),
    });



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
                bootcash: '',


            },


        }

        );


    useEffect(() => {
        setValue('bootcash', cashInHandDetails?.boot_cash_limit)
        setBootCash(cashInHandDetails?.boot_cash_limit)
    }, [cashInHandDetails])






    const OnChangePriority = (event: any) => {
        const newValue = event.target.value;
        setValue("bootcash", newValue)
        setBootCash(newValue)
    }

    const Submit = async (data: any) => {
        setLoading(true);
        console.log(data);
        if (data.bootcash < 0) {
            toast.error("BootCash cannot be a negative value.");
            setLoading(false);
            return;
        }
        try {
            //   let result = franchiseList?.filter((res: any) => res?._id ===SelectedValue).map((get: any) => (
            //     {
            //         name: get?.name,
            //         _id: get?._id,
            //         mobile: get?.mobile,

            //     }


            // ))


            let data = {
                //   order_id: franchiseData?._id,
                rider_id: rider_id,
                bootcash: bootcash

            }


            const response = await postData('admin/rider-support/cash-in-hand/update-bootcash', data);


            handleClose(true)
            toast.success("BootCash Limit Successfuly Updated");
            reset();
            mutate()


        } catch (error: any) {
            //   console.error(error.message ,"l");
            toast.error(error?.message);
        } finally {
            setLoading(false);
        }
    };




    //     const riderBasedOnFranchasee = async (franchiseData:any) => {
    //       try {
    //         let franchase_id=(franchiseData?.franchisee?._id);
    //         setfranchase_id(franchase_id)
    //           setLoading(true)
    //           const response = await fetchData(`admin/onboarding/riders/${franchase_id}`)
    //           setFranchiseList(response?.data?.data)

    //       } catch (err: any) {
    //           toast.error(err?.message)
    //           setLoading(false)
    //       } finally {
    //           setLoading(false)
    //       }
    //   }


    //     useEffect(() => {
    //       riderBasedOnFranchasee(franchiseData);
    //   }, []);


    return (
        <Dialog
            onClose={handleClose}

            open={open}
            maxWidth={'xs'}
            fullWidth
        >
            <Box p={1} >
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
                        }}>{'Bootcash'}</Typography>
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
                    <Grid container spacing={2} display={'flex'} flexDirection={'row'} justifyItems={'center'}>
                        <Grid item xs={12} lg={12}>
                            <CustomInput
                                onChangeValue={OnChangePriority}
                                type='text'
                                control={control}
                                error={errors.bootcash}
                                fieldName="bootcash"
                                placeholder={``}
                                fieldLabel={"BootCash"}
                                disabled={false}
                                view={false}

                                defaultValue={''}
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
    )
}

export default BootCashModal