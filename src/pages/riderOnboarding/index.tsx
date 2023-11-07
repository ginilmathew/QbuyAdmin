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
import { useRouter } from 'next/router';


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
    //boot_cash_limit: string;
};

const RiderOnBoarding = () => {

    const schema = yup.object().shape({
        name: yup.string()
            .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Rider Name should contain only characters")
            .required("Rider Name is required"),
        mobile: yup.string()
            .required("Mobile Number is required")
            .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits long and contain only numeric characters"),
        gender: yup.string().required("Gender is required"),
        emergency_contact: yup.string()
            .matches(/(^[0-9]{10}$)|^$/, "Emergency Contact must be 10 digits long and contain only numeric characters")
            .nullable()
            .notRequired(),

        aadhar_card_number: yup.string()
            .matches(/^$|^[0-9]{12}$/, "Aadhaar Number should be 12 digits long and contain only numeric characters")
            .nullable()
            .notRequired(),

        account_number: yup.string()
            .matches(/^$|^[0-9]+$/, "Account Number should contain only numeric characters")
            .max(13, "Account Number should not exceed 13 characters")
            .nullable()
            .notRequired(),


        account_name: yup.string()
            .matches(/^[A-Za-z]*$/, "Account Name should contain only characters")
            .nullable()
            .notRequired(),


    });


    const [imagefile, setImagefile] = useState<null | File>(null)
    const [type, settype] = useState<string>("");
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<any>(null)
    const router = useRouter();


    const {
        register,
        handleSubmit,
        control,
        trigger,
        setError,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormInputs>({
        resolver: yupResolver(schema),
    });


    // const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     settype(e.target.value);
    // }

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
    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedGender = e.target.value;
        settype(selectedGender);
        setValue('gender', selectedGender, { shouldValidate: true });
        trigger('gender');
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


    const onSubmit = async (data: FormInputs) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('mobile', data.mobile);
            formData.append('emergency_contact', data.emergency_contact);
            formData.append('gender', type);
            //formData.append('boot_cash_limit', data.boot_cash_limit);
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
                router.push("/onboardingList");
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
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
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


                    <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                    <Box my={3}>
                        <Divider />
                    </Box>

                    {/* <Grid item xs={11} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.boot_cash_limit}
                            fieldName="boot_cash_limit"
                            placeholder={``}
                            fieldLabel={"Boot Cash Limit"}
                            disabled={false}
                            view={false}

                        />
                    </Grid> */}
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Register Rider'} onClick={handleSubmit(onSubmit)} />
            </Box>

        </Box>
    )
}

export default RiderOnBoarding
