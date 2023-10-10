import { Box, Grid, MenuItem, Typography } from '@mui/material'
import React, { startTransition, useCallback, useState, useEffect } from 'react'
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomBox from '../CustomBox';
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';
import Custombutton from '@/components/Custombutton';
import { fetchData, postData } from '@/CustomAxios';
import { SubmitHandler } from "react-hook-form";

type Inputs = {
    name: any;
    mobile: any;
    email: any;
    customer_group_id: string;
    customer_block_status: string;
    address: any;
}
type props = {
    resData?: any,
    view?: any
}

type IFormInput = {
    name: any;
    email: any;
    mobile: any;
    customer_group_id: string;
    customer_block_status: string;
    address: any;

}
const CustomerDetailsForm = ({ resData, view }: props) => {



    const schema = yup.object().shape({
        name: yup.string().required('Customer Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        mobile: yup.string().required('Mobile Number is required'),

    });


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            mobile: '',
            group: '12345',
            customer_block_status: '',
        },

    });


    const CheckBlackList = () => {

        setIsChecked(!isChecked);
    };

    const [loading, setLoading] = useState(false);
    const [numAddresses, setNumAddresses] = useState(1);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [datas, setDatas] = useState([])
    const [isChecked, setIsChecked] = useState(true);

    const addAddressSection = () => {
        setNumAddresses(numAddresses + 1);
        if (numAddresses >= 1) {
            setShowDeleteButton(true);
        }
    };

    const deleteAddressSection = () => {
        if (numAddresses > 1) {
            setNumAddresses(numAddresses - 1);
        } else {
            setShowDeleteButton(false);
        }
    };

    const [selectedValue, setSelectedValue] = useState('');

    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
    };


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true);

        try {
            const response = await postData('/admin/customer-details/create', data);

            if (response.data.success) {
                toast.success('Customer created successfully');
                reset();
            } else {
                toast.error('Failed to create customer');
            }
        } catch (error) {
            toast.error('An error occurred while creating the customer');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Box>
            <CustomBox title='Basic Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.email}
                            fieldName="email"
                            placeholder={``}
                            fieldLabel={"Email Address"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>

                        <Customselect
                            type='text'
                            control={control}
                            error={errors.customer_block_status}
                            fieldName="customer_block_status"
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={selectedValue}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={isChecked} label='' onChange={CheckBlackList} title='Blacklist Customer' />
                    </Grid>
                </Grid>
            </CustomBox>
            {Array.from({ length: numAddresses }).map((_, index) => (

                <CustomBox title='Address Details'>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Grid container spacing={2}>
                            <Grid item xs={13} lg={5}>
                                <CustomInput
                                  type='text'
                                  control={control}
                                  error={errors}
                                  fieldName="address"
                                  placeholder={``}
                                  fieldLabel={" Address"}
                                  disabled={false}
                                  view={false}
                                  defaultValue={''}
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors}
                                    fieldName="no"
                                    placeholder={``}
                                    fieldLabel={"House or Flat No"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors}
                                    fieldName="city"
                                    placeholder={``}
                                    fieldLabel={"City"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors}
                                    fieldName="landmark"
                                    placeholder={``}
                                    fieldLabel={"LandMark"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    type='text'
                                    control={control}
                                    error={errors}
                                    fieldName="pincode"
                                    placeholder={``}
                                    fieldLabel={"Pincode"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <Customselect
                                    type='text'
                                    control={control}
                                    error={errors}
                                    fieldName="category"
                                    placeholder={``}
                                    fieldLabel={"Category"}
                                    selectvalue={""}
                                    height={40}
                                    label={''}
                                    size={16}
                                    value={"category"}
                                    options={''}
                                    onChangeValue={"onChangeSelect"}
                                    background={'#fff'}
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Customselect>
                            </Grid>
                            {/* <Grid item xs={10} lg={4}>
                                <Typography mb={3}></Typography>
                                <CustomCheckBox isChecked={true} label='' onChange={CheckBlackList} title='Set as Default Address' />
                            </Grid> */}
                        </Grid>
                        {/* <div style={{ position: 'relative', top: '-93px',width: '124px',height:'36px'}}>
                        <Custombutton
                            btncolor=""
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={'30px'}
                            label={'Add More'}
                            onClick={addAddressSection}
                        />
                    </div> */}
                        <div style={{ position: 'relative', top: '-93px', width: '124px', height: '36px' }}>
                            {showDeleteButton ? (
                                <Custombutton
                                    btncolor=""
                                    IconEnd={''}
                                    IconStart={''}
                                    endIcon={false}
                                    startIcon={false}
                                    height={'30px'}
                                    label={'Delete'}
                                    onClick={deleteAddressSection}
                                />
                            ) : (
                                <Custombutton
                                    btncolor=""
                                    IconEnd={''}
                                    IconStart={''}
                                    endIcon={false}
                                    startIcon={false}
                                    height={'30px'}
                                    label={'Add More'}
                                    onClick={addAddressSection}
                                />
                            )}
                        </div>


                    </Box>

                </CustomBox>
            ))}
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Customer'} onClick={handleSubmit(onSubmit)} />
            </Box>
        </Box>
    )
}

export default CustomerDetailsForm