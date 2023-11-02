import CustomBox from '@/Widgets/CustomBox'
import { Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import Customselect from '@/components/Customselect';
import CustomImageUploader from '@/components/CustomImageUploader';
import Custombutton from '@/components/Custombutton';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';


type FormInputs = {
    name: string;
    mobile: string;
    emergency_contact: string;
    gender: string;
    image: any;
    aadhar_card_number: string;
    pan_card_number: string;
    driving_license: string;
    rc_book_number: string;
    account_number: string;
    ifsc: string;
    branch: string;
    account_name: string;
};

const RiderOnBoarding = () => {

    const schema = yup.object().shape({
        name: yup.string().required("Rider Name is required"),
        mobile: yup.string().required("Mobile Number is required"),
    });

    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>("");
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<any>(null)


    // const { register,
    //     handleSubmit,
    //     control,
    //     setError,
    //     formState: { errors },
    //     reset,
    //     setValue, } = useForm<FormInputs>();
        
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormInputs>({
        resolver: yupResolver(schema),
    });
    

    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        settype(e.target.value);
    }

    const imageUploder = (file: any) => {
        if (file.size <= 1000000) {
            setImagefile(file)
            setImagePreview(null)
            setValue('image', file)
            setError('image', { message: '' })

        } else {
            setImagePreview(null)
            setImagefile(null)
            toast.warning('Image should be less than or equal 1MB')
        }
    }

    const [genderOptions, setGenderOptions] = useState<any>([
        {
            value: 'male',
            name: 'Male'
        },
        {
            value: 'female',
            name: 'Female'
        },
        {
            value: 'others',
            name: 'Others'
        }
    ]);


    const onSubmit = async (data: FormInputs) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('mobile', data.mobile);
            formData.append('emergency_contact', data.emergency_contact);
            formData.append('gender', type);
            if (imagefile) {
                formData.append("image", data?.image);
            }

            const kycDetails = {
                aadhar_card_number: data.aadhar_card_number,
                pan_card_number: data.pan_card_number,
                driving_license: data.driving_license,
                rc_book_number: data.rc_book_number
            };
            formData.append('kyc_details', JSON.stringify(kycDetails));

            const bankAccountDetails = {
                account_number: data.account_number,
                ifsc: data.ifsc,
                branch: data.branch,
                account_name: data.account_name
            };
            formData.append('bank_account_details', JSON.stringify(bankAccountDetails));

            const response = await postData('/admin/onboarding', formData);

            if (response.status === 201 || response.status === 200) {

                toast.success("Rider successfully added");
                reset();
            } else {

                toast.error("Failed");
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Typography py={2} sx={{ color: '#58D36E', fontFamily: `'Poppins' sans-serif`, fontSize: 30, fontWeight: 'bold' }}>Onboarding</Typography>
            <CustomBox title='Rider Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Rider Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Phone Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.emergency_contact}
                            fieldName="emergency_contact"
                            placeholder={``}
                            fieldLabel={"Emergency Contact"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <Customselect
                            type="text"
                            control={control}
                            error={errors.gender}
                            fieldName="gender"
                            placeholder=""
                            fieldLabel="Gender"
                            selectvalue=""
                            height={40}
                            label=""
                            value={type}
                            onChangeValue={onChangeSelect}
                            background="#fff"
                            options={genderOptions}
                            size={20}
                        >
                            {genderOptions.map((option: any) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Customselect>
                    </Grid>


                    <Grid item xs={12} lg={2}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.image}
                            fieldName="image"
                            placeholder={``}
                            fieldLabel={"Image"}
                            control={control}
                            height={130}
                            max={5}
                            onChangeValue={imageUploder}
                            viewImage={imagePreview}
                            preview={imagefile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"100%"}
                        />
                    </Grid>

                </Grid>
                <Box my={3}>
                    <Divider />
                </Box>
                <Box >
                    <Typography py={2} sx={{ fontFamily: `'Poppins' sans-serif`, fontSize: 18, fontWeight: 'bold' }}>KYC</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.aadhar_card_number}
                            fieldName="aadhar_card_number"
                            placeholder={``}
                            fieldLabel={"Adhaar Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.pan_card_number}
                            fieldName="pan_card_number"
                            placeholder={``}
                            fieldLabel={"PAN Card Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.driving_license}
                            fieldName="driving_license"
                            placeholder={``}
                            fieldLabel={"Driving License"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.rc_book_number}
                            fieldName="rc_book_number"
                            placeholder={``}
                            fieldLabel={"RC Book Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
                <Box my={3}>
                    <Divider />
                </Box>
                <Box py={1}>
                    <Typography py={2} sx={{ fontFamily: `'Poppins' sans-serif`, fontSize: 18, fontWeight: 'bold' }}>Bank Account Details</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.account_number}
                            fieldName="account_number"
                            placeholder={``}
                            fieldLabel={"Account Number"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.ifsc}
                            fieldName="ifsc"
                            placeholder={``}
                            fieldLabel={"IFSC"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.branch}
                            fieldName="branch"
                            placeholder={``}
                            fieldLabel={"Branch"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.4}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.account_name}
                            fieldName="account_name"
                            placeholder={``}
                            fieldLabel={"Account Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Register Rider'} onClick={handleSubmit(onSubmit)} />
            </Box>

        </Box>
    )
}

export default RiderOnBoarding
