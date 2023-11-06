import CustomInput from '@/components/CustomInput'
import { Box, Divider, Grid, Typography, MenuItem, Avatar } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler, set } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import CustomImageUploader from '@/components/CustomImageUploader';
import Customselect from '@/components/Customselect';
//import { useJsApiLoader } from "@react-google-maps/api";
import { fetchData } from '@/CustomAxios';
import CustomTimepicker from '@/components/CustomTimepicker';
import { postData } from '@/CustomAxios';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import moment from 'moment'
import CustomMultiselect from '@/components/CustomMultiselect';
import Maps from '@/components/maps/maps';
import Polygon from '@/components/maps/Polygon';
import { useRouter } from 'next/router';
import { IMAGE_URL } from '../../Config/index';
import CustomLoader from '@/components/CustomLoader';
import CustomTab from '@/components/CustomTab';




type Inputs = {
    name: string;
    mobile: string;
    gender: string;
    emergency_contact: string;
    city: string;
    vehicle_number: string;
    aadhar_card_number: string;
    franchise_name: string;
    ifsc: string;
    driving_license: string;
    pan_card_number: string;
    rc_book_number: string;
    account_number: string;
    branch: string;
    account_name: string;
    franchise_id: string;
    //status: string;
    image: any,


};


type RiderGroup = {
    _id: string;
    franchise_name: string;
    franchise_id: string;
};
type IFormInput = {
    name: string;
    mobile: string;
    gender: string;
    emergency_contact: string;
    city: string;
    vehicle_number: string;
    aadhar_card_number: string;
    franchise_name: string;
    ifsc: string;
    driving_license: string;
    pan_card_number: string;
    rc_book_number: string;
    account_number: string;
    branch: string;
    account_name: string;
    //status: string;
    franchise_id: string;
    image: any,


}
type props = {
    res?: any,
    view?: any

}
const RiderSupportform = ({ res, view }: props) => {


    const idd = res ? res : view;

    const router = useRouter();
console.log(idd);


    const [imagefile, setImagefile] = useState<null | File>(null)
    const [imagePreview, setImagePreview] = useState<any>(null)
    const [category, setCategory] = useState<string>('')
    const [franchise, setFranchise] = useState<string>('')
    const [getfranchise, setGetFranchise] = useState<any>([])
    const [getcategory, setGetCategory] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [multpleArray, setMultipleArray] = useState<any>([]);
    const [postArray, setPostArray] = React.useState<any>([]);
    const [paths, setPaths] = useState<any>(null)
    const [subOnboardingList, setOnboardingList] = useState<any>([])
    console.log({ subOnboardingList }, 'value')
    const [type, settype] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [franchiseList, setFranchiseList] = useState<RiderGroup[]>([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedValues, setSelectedValues] = useState<string>('');
    const [selectedVal, setSelectedVal] = useState<string>('');
    const [selectedFranchisees, setSelectedFranchisees] = useState<string[]>(['']);
    const [selectedFranchiseName, setSelectedFranchiseName] = useState("");
    const [selectedFranchiseNames, setSelectedFranchiseNames] = useState<string[]>([]);
   // const [statusSelect, setStatusSelect] = useState<any>(null)




    // const schema = yup.object().shape({
    //     name: yup.string().required("Rider Name is required"),
    //     mobile: yup.string()
    //     .required("Mobile Number is required")
    //     .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits long and contain only numeric characters"),
    //     emergency_contact: yup.string()
    //     .required("Mobile Number is required")
    //     .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits long and contain only numeric characters"),
    //     gender: yup.string().required("Gender is required"),

    // });
    const schema = yup.object().shape({
        name: yup.string().matches(/^[A-Za-z]+$/, "Rider Name should contain only characters").required("Rider Name is required"),
        mobile: yup.string()
            .required("Mobile Number is required")
            .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits long and contain only numeric characters"),
        emergency_contact: yup.string()
            .required("Emergency Contact is required")
            .matches(/^[0-9]{10}$/, "Emergency Contact must be 10 digits long and contain only numeric characters"),
        gender: yup.string().required("Gender is required"),
        aadhar_card_number: yup.string()
            .matches(/^[0-9]+$/, "Adhaar Number should contain only numeric characters")
            .max(13, "Adhaar Number should not exceed 13 characters"),
        account_number: yup.string()
            .matches(/^[0-9]+$/, "Account Number should contain only numeric characters")
            .max(13, "Account Number should not exceed 13 characters"),
        account_name: yup.string().matches(/^[A-Za-z]+$/, "Account Name should contain only characters"),
    });



    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                name: '',
                mobile: '',
                gender: '',
                emergency_contact: '',
                city: '',
                vehicle_number: '',
                aadhar_card_number: '',
                franchise_name: '',
                ifsc: '',
                driving_license: '',
                pan_card_number: '',
                rc_book_number: '',
                account_number: '',
                branch: '',
                account_name: '',
               // status: '',
                franchise_id: '',
            }
        });


    const genderOptions = [
        { value: 'male', name: 'Male' },
        { value: 'female', name: 'Female' },
        { value: 'other', name: 'Other' },
    ];

    // const [statusChange, setStatusChange] = useState<any>(
    //     [
    //         { value: 'online', name: 'online' },
    //         { value: 'offline', name: 'offline' },
    //         { value: 'logged out', name: 'logged out' }
    //     ])


    const onChangeSelect = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setSelectedGender(e.target.value as string);
        setValue('gender', e.target.value as string);
    };

    // const ChangeStatus = useCallback((e: any) => {
    //     const { value } = e.target;
    //     setStatusSelect(value)
    // }, [])

    const addMoreFranchisee = () => {
        setSelectedFranchisees([...selectedFranchisees, '']);
    };

    const handleFranchiseSelects = (index: number, e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const selectedFranchiseId = e.target.value as string;
        const selectedFranchise = franchiseList.find((franchise) => franchise.franchise_id === selectedFranchiseId);

        if (selectedFranchise) {
            setSelectedFranchisees((prevSelectedFranchisees: string[]) => {
                const updatedFranchisees = [...prevSelectedFranchisees];
                updatedFranchisees[index] = selectedFranchiseId;
                return updatedFranchisees;
            });

            setSelectedFranchiseNames((prevSelectedFranchiseNames: string[]) => {
                const updatedFranchiseNames = [...prevSelectedFranchiseNames];
                updatedFranchiseNames[index] = selectedFranchise.franchise_name;
                return updatedFranchiseNames;
            });
        }
    };

    const handleFranchiseSelect = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const selectedFranchiseId = e.target.value as string;
        const selectedFranchise = franchiseList.find((franchise) => franchise.franchise_id === selectedFranchiseId);

        if (selectedFranchise) {
            setSelectedValue(selectedFranchiseId);
            setSelectedFranchiseName(selectedFranchise.franchise_name);
            setValue('franchise_id', selectedFranchiseId);
            setValue('franchise_name', selectedFranchise.franchise_name);
        }
    };


    useEffect(() => {
        getOnboardingList()
    }, [])

    const getOnboardingList = async () => {
        try {
            setLoader(true)
            const response = await fetchData(`admin/onboarding/show/${idd}`)
            setOnboardingList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        if (subOnboardingList && idd) {
            setValue('name', subOnboardingList?.name);
            setValue('mobile', subOnboardingList?.mobile);
            setValue('emergency_contact', subOnboardingList?.emergency_contact);
            setValue('city', subOnboardingList?.city);
            setValue('vehicle_number', subOnboardingList?.vehicle_number);
            setValue('aadhar_card_number', subOnboardingList?.kyc_details?.aadhar_card_number);
            setValue('ifsc', subOnboardingList?.bank_account_details?.ifsc);
            setValue('driving_license', subOnboardingList?.kyc_details?.driving_license);
            setValue('pan_card_number', subOnboardingList?.kyc_details?.pan_card_number);
            setValue('rc_book_number', subOnboardingList?.kyc_details?.rc_book_number);
            setValue('account_number', subOnboardingList?.bank_account_details?.account_number)
            setValue('branch', subOnboardingList?.bank_account_details?.branch);
            setValue('account_name', subOnboardingList?.bank_account_details?.account_name);
            setImagePreview(`${IMAGE_URL}${subOnboardingList?.image}`)
            setSelectedGender(subOnboardingList?.gender || '');
            setSelectedValue(subOnboardingList?.primary_franchise?.franchise_id || '');
            setValue('franchise_id', subOnboardingList?.primary_franchise?.franchise_id);
            setValue('franchise_name', subOnboardingList?.primary_franchise?.franchise_name);
            setValue('franchise_id', subOnboardingList?.secondary_franchise?.franchise_id);
            setValue('franchise_name', subOnboardingList?.secondary_franchise?.franchise_name);
            //setStatusSelect(subOnboardingList?.status || '');

        }
    }, [subOnboardingList, idd]);



    const imageUploder = (file: any) => {
        if (file.size <= 1000000) {
            setImagefile(file)
            setImagePreview(null)
            setValue('image', file)
            setError('image', { message: '' })
        } else {
            setImagefile(null)
            setImagePreview(null)
            toast.warning('Image should be less than or equal 1MB')
        }

    }

    const fetchFranchiseList = async () => {
        try {
            const response = await fetchData("/admin/franchise/list");
            const franchiseListData = response.data.data;
            console.log("Franchise List API Response:", franchiseListData);
            setFranchiseList(franchiseListData);
        } catch (error) {
            console.error("Failed to fetch franchise list:", error);
            toast.error("Failed to fetch franchise list");
        }
    };

    useEffect(() => {

        fetchFranchiseList();
    }, []);

    const onSubmit = async (data: IFormInput) => {
        setLoading(true);
        //data.status = statusSelect;

        try {
            const formData = new FormData();
            const URL_UPDATE = "/admin/onboarding/update";

            formData.append("id", idd);
            formData.append("name", data.name);
            formData.append("mobile", data.mobile);
            formData.append("gender", data.gender);
            formData.append("emergency_contact", data.emergency_contact);
            formData.append("city", data.city);
            formData.append("vehicle_number", data.vehicle_number);
            //formData.append("online_status", data.status);


            const kycDetails = {
                aadhar_card_number: data.aadhar_card_number,
                pan_card_number: data.pan_card_number,
                driving_license: data.driving_license,
                rc_book_number: data.rc_book_number,
            };
            formData.append("kyc_details", JSON.stringify(kycDetails));


            const bankAccountDetails = {
                account_number: data.account_number,
                ifsc: data.ifsc,
                branch: data.branch,
                account_name: data.account_name,
            };
            formData.append("bank_account_details", JSON.stringify(bankAccountDetails));



            const primaryFranchise = {
                franchise_id: selectedValue,
                franchise_name: data.franchise_name,
            };

            formData.append("primary_franchise", JSON.stringify(primaryFranchise));
            const secondaryFranchises = selectedFranchisees.map((franchiseId, index) => {
                return {
                    franchise_id: franchiseId,
                    franchise_name: selectedFranchiseNames[index],
                };
            });

            formData.append("secondary_franchise", JSON.stringify(secondaryFranchises));

            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await postData(URL_UPDATE, formData);

            if (response.status === 201) {
                toast.success("RiderSupport updated successfully");
                reset();
                router.push("/riderSupport");
            } else {
                toast.error("Failed");
            }
        } catch (error) {
            toast.error("An error occurred while updating the Rider");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <CustomBox title='Rider Details'>
                <Box display={'flex'}>

                    <Grid item xs={11} lg={3}>

                        <Box flex={.3} sx={{}}>
                            <CustomImageUploader
                                ICON={""}
                                viewImage={imagePreview}
                                error={errors.image}
                                fieldName="image"
                                placeholder={``}
                                fieldLabel={"Profile Picture"}
                                control={control}
                                height={150}
                                max={5}
                                onChangeValue={imageUploder}
                                preview={imagefile}
                                previewEditimage={""}
                                type={"file"}
                                background="#e7f5f7"
                                myid="contained-button-file"
                                width={"150%"}

                            />
                        </Box>
                    </Grid>
                    <Grid container flex={0.9} spacing={2} sx={{ paddingTop: '22px', marginLeft: "65px" }}>
                        <Grid item xs={11} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="name"
                                placeholder={``}
                                fieldLabel={"Rider Name"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>

                        <Grid item xs={11} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.mobile}
                                fieldName="mobile"
                                placeholder={``}
                                fieldLabel={"Phone Number"}
                                disabled={false}
                                view={view ? true : false}
                            />
                        </Grid>
                        <Grid item xs={11} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.emergency_contact}
                                fieldName="emergency_contact"
                                placeholder={``}
                                fieldLabel={"Emergency Contact"}
                                disabled={false}
                                view={view ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} lg={2.4}>
                            <Customselect
                                disabled={view ? true : false}
                                type="text"
                                control={control}
                                error={errors.gender}
                                fieldName="gender"
                                placeholder=""
                                fieldLabel="Gender"
                                selectvalue=""
                                height={40}
                                label=""
                                value={selectedGender}
                                onChangeValue={onChangeSelect}
                                background="#fff"
                                options={genderOptions}
                                size={20}
                            >
                                {genderOptions.map((option: any) => (
                                    <MenuItem key={option.value} value={option.value} >
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Customselect>

                        </Grid>

                        <Grid item xs={11} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.city}
                                fieldName="city"
                                placeholder={``}
                                fieldLabel={"City"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={11} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.vehicle_number}
                                fieldName="vehicle_number"
                                placeholder={``}
                                fieldLabel={"Vehicle No"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={11} lg={3}>
                            <Customselect
                                disabled={view ? true : false}
                                type="text"
                                control={control}
                                error={errors.franchise_id}
                                fieldName="franchise_id"
                                placeholder={``}
                                fieldLabel={"Primary Franchisee"}
                                selectvalue={selectedValues}
                                height={40}
                                label={""}
                                size={16}
                                value={selectedValue}
                                onChangeValue={handleFranchiseSelect}
                                background={"#fff"}
                                options={franchiseList}
                            >
                                {franchiseList.map((franchise) => (
                                    <MenuItem
                                        key={franchise._id}
                                        value={franchise.franchise_id}
                                    >
                                        {franchise?.franchise_name}
                                    </MenuItem>
                                ))}
                            </Customselect>
                        </Grid>

                        <Grid container spacing={2} sx={{ paddingTop: '22px', marginLeft: '1px' }}>
                            {selectedFranchisees.map((franchiseId, index) => (
                                <Grid item xs={11} lg={3} key={index}>
                                    <Customselect
                                        disabled={view ? true : false}
                                        type="text"
                                        control={control}
                                        error={errors.franchise_id}
                                        fieldName={`franchise_id_${index}`}
                                        placeholder={``}
                                        fieldLabel={`Secondary Franchisee `}
                                        selectvalue={selectedFranchisees[index]}
                                        height={40}
                                        label={""}
                                        size={16}
                                        value={selectedFranchisees[index]}
                                        onChangeValue={(e:any) => handleFranchiseSelects(index, e)}

                                        background={"#fff"}
                                        options={franchiseList}
                                    >
                                        {franchiseList.map((franchise) => (
                                            <MenuItem
                                                key={franchise._id}
                                                value={franchise.franchise_id}
                                            >
                                                {franchise?.franchise_name}
                                            </MenuItem>
                                        ))}
                                    </Customselect>
                                </Grid>
                            ))}
                        </Grid>
                       


                        {!view &&

                            <button onClick={addMoreFranchisee} style={{ color: 'white', backgroundColor: 'red', marginTop: '30px', marginLeft: '15px' }}>
                                Add More Franchisee
                            </button>}

                    </Grid>

                </Box>
                <Box py={2}>
                    <Divider />

                </Box>

                <CustomBox title='KYC '>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.aadhar_card_number}
                                fieldName="aadhar_card_number"
                                placeholder={``}
                                fieldLabel={"Adhaar Number"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.pan_card_number}
                                fieldName="pan_card_number"
                                placeholder={``}
                                fieldLabel={"PAN Card Number"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.driving_license}
                                fieldName="driving_license"
                                placeholder={``}
                                fieldLabel={"Driving License"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.rc_book_number}
                                fieldName="rc_book_number"
                                placeholder={``}
                                fieldLabel={"RC Book Number"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                    </Grid>
                    <Box py={2}>
                        <Divider />

                    </Box>
                    <Typography fontSize={22} fontWeight={'bold'} py={3}>Bank Account Details</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.account_number}
                                fieldName="account_number"
                                placeholder={``}
                                fieldLabel={"Account Number"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.ifsc}
                                fieldName="ifsc"
                                placeholder={``}
                                fieldLabel={"IFSC"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.branch}
                                fieldName="branch"
                                placeholder={``}
                                fieldLabel={"Branch"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>
                        <Grid item xs={12} lg={2.5}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.account_name}
                                fieldName="account_name"
                                placeholder={``}
                                fieldLabel={"Account Name"}
                                disabled={false}
                                view={view ? true : false}

                            />
                        </Grid>

                    </Grid>

                </CustomBox>

                {/* <Grid container spacing={2}>
                    <Grid item lg={2} md={2} xs={12}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.status}
                            fieldName="status"
                            placeholder={``}
                            fieldLabel={"Status Change"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={statusSelect}
                            options={''}
                            onChangeValue={ChangeStatus}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <em>Change Status</em>
                            </MenuItem>
                            {statusChange.map((res: any) => (
                                <MenuItem value={res?.value}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                </Grid> */}


            </CustomBox>


            {!view &&
                <Box py={3}>
                    <Custombutton
                        btncolor=''
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={'Update'}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    />
                </Box>}
        </Box>
    )
}

export default RiderSupportform