
import { postData } from '@/CustomAxios';
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import { Box, Dialog, DialogContent, Grid, Typography } from '@mui/material'

import { GridCloseIcon, GridColDef } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";



const FranchiseEnquiryModal = ({ open, close, res,mutate }) => {

    console.log({ res })



    const { register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue, } = useForm({
            defaultValues: {

            }
        });




    const clearData = () => {
        close()
    }


    const submitForm = async (data) => {
        let value = {
            ...res
        }
        value['status'] = data?.franchise_enquiry;
        value['id'] = value?._id;
        delete value.updated_at;
        delete value.created_at;
        delete value._id
        try {
            await postData('admin/franchise-enquiry/update', value);
            toast.success('Updated Successfully');
            mutate();
            reset();
            clearData();

        } catch (err) {
            toast.error(err?.messsage)
        }

    }


    return (
        <Box>
            <Dialog onClose={clearData} open={open} fullWidth={true}
                maxWidth={'xs'} >
                <Box p={2} >
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>
                            <Typography
                                fontSize={16}
                                fontWeight={'bold'}
                                color="#000"
                                letterSpacing={1}
                                sx={{ fontFamily: `'Poppins' sans-serif`, }}>Edit Franchise Enquiry</Typography>
                        </Box>

                        <Box onClick={clearData}>
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
                                <GridCloseIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                        </Box>
                    </Box>
                    <DialogContent>

                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={12}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors.franchise_enquiry}
                                    fieldName="franchise_enquiry"
                                    placeholder={``}
                                    fieldLabel={"Franchise Enquiry"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>

                        </Grid>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={5}>
                            <Custombutton
                                btncolor=''
                                IconEnd={''}
                                IconStart={''}
                                endIcon={false}
                                startIcon={false}
                                height={''}
                                label={'Update'}
                                onClick={handleSubmit(submitForm)}
                            // disabled={loading}
                            />
                        </Box>


                    </DialogContent>


                </Box>

            </Dialog>
        </Box>
    )
}

export default FranchiseEnquiryModal;