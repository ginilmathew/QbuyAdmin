import { Box, Grid, MenuItem, Typography, Stack } from "@mui/material";
import React, {
    startTransition,
    useCallback,
    useState,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import CustomBox from "../CustomBox";
import CustomInput from "@/components/CustomInput";
import Customselect from "@/components/Customselect";
import CustomCheckBox from "@/components/CustomCheckBox";
import Custombutton from "@/components/Custombutton";
import { fetchData, postData } from "@/CustomAxios";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import moment from 'moment';
import CustomDateTimePicker from '@/components/CustomDateTimePicker';
import CustomTextarea from '@/components/CustomTextarea';


const CustomDatePicker = dynamic(() => import('@/components/CustomDatePicker'), { ssr: false });

type Inputs = {
    title: string;
    description: string;
    image_link: string;
    app_target: string;
    product_url: string;
    name: string;
    email: string;
    mobile: string;
    franchise_id: string;
    franchise_name: string;
    status: string;
    image: string;
    instant: string;
    notification_sound: string;
    schedule_date_time: any

};

type RiderGroup = {
    _id: string;
    franchise_name: string;
    franchise_id: string;
};

type props = {
    resData?: any;
    view?: any;
};

const PushNotificationForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;
    const [statusChange, setStatusChange] = useState<any>(
        [
            { value: 'customer', name: 'customer' },
            { value: 'vendor', name: 'vendor' },
            { value: 'rider', name: 'rider' }
        ])


    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const router = useRouter();
    const [categoryList, setCategoryList] = useState<any>([]);
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    //const [fromDate, setFromDate] = useState<moment.Moment | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [franchiseList, setFranchiseList] = useState<RiderGroup[]>([]);
    const [selectedFranchiseName, setSelectedFranchiseName] = useState("");
    const [statusSelect, setStatusSelect] = useState<any>(null)
    const [instantBlock, setInstantBlock] = useState<boolean>(false);
    const [notificationBlock, setNotificationBlock] = useState<boolean>(false);
    const [notificationList, setNotificationList] = useState<any>([]);
    console.log({ notificationList }, "listdply")
    const [time, setTime] = useState<any>(null);


    const schema = yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string().required('Description is required'),
        franchise_id: yup.string().required('Franchise is required'),
        franchise_name: yup.string().required('Franchise name is required'),
        schedule_date_time: yup.string().required('Date & Time is Required'),
        app_target: yup.string().required('App target is Required')
    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue, setError, clearErrors } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: {

        }
    });


    const CheckBlackList = (e: any) => {
        if (!view) {
            setInstantBlock(e);
            setValue("instant", e);
        }
    };

    const CheckBlackLists = (e: any) => {
        if (!view) {
            setNotificationBlock(e);
            setValue("notification_sound", e);
        }
    };
    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
    };
    const OnChangeDate = (value: any) => {
        setValue('schedule_date_time', value)
        setTime(value)
        setError('schedule_date_time', { message: "" })
    }

    const onSubmit = async (data: Inputs) => {
        setLoading(true);
        const formattedDateTime = time ? time.format("YYYY-MM-DD HH:mm:ss") : null;

        try {
            const payload = {
                id: idd,
                title: data.title,
                description: data.description,
                type: type,
                instant: instantBlock,
                image_link: data.image_link || "",
                schedule_date_time: formattedDateTime,
                app_target: statusSelect || "",
                product_url: data.product_url || "",
                franchise: {
                    id: data.franchise_id || "",
                    name: data.franchise_name || "",
                },
                notification_sound: notificationBlock,
            };

            const URL_CREATE = "/admin/push-notification/create";
            const URL_UPDATE = "/admin/push-notification/update";

            const response = await postData(idd ? URL_UPDATE : URL_CREATE, payload);

            if (response.status === 201 || response.status === 200) {
                const successMessage = idd ? "Push notification updated successfully" : "Push notification created successfully";
                toast.success(successMessage);
                reset();
                router.push("/pushnotification");
            } else {
                toast.error("Failed to update push notification");
            }
        } catch (error) {
            toast.error("An error occurred while updating push notification");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    const notificationview = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/push-notification/show/${idd}`);
            const notificationData = response?.data?.data;
            reset(notificationData);
            setNotificationList(notificationData);
            setStatusSelect(notificationData.app_target);
            setInstantBlock(notificationData.instant);
            setNotificationBlock(notificationData.notification_sound);

        } catch (err: any) {
            toast.error(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (idd) {
            notificationview();
        }
    }, [idd]);



    const handleFranchiseSelect = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const selectedFranchiseId = e.target.value as string;
        const selectedFranchise = franchiseList.find((franchise) => franchise._id === selectedFranchiseId);

        if (selectedFranchise) {
            setSelectedValue(selectedFranchiseId);
            setSelectedFranchiseName(selectedFranchise.franchise_name);
            setValue("franchise_id", selectedFranchiseId);
            setValue('franchise_name', selectedFranchise.franchise_name);
        }
    };


    const fetchFranchiseList = async () => {
        try {
            const response = await fetchData("/admin/franchise/list");
            const franchiseListData = response.data.data;
            setFranchiseList(franchiseListData);
        } catch (error) {
            console.error("Failed to fetch franchise list:", error);
            toast.error("Failed to fetch franchise list");
        }
    };

    useEffect(() => {

        fetchFranchiseList();
    }, []);

    useEffect(() => {
        if (notificationList && notificationList.franchise && notificationList.franchise.name) {
            setSelectedValue(notificationList.franchise.id);
            setSelectedFranchiseName(notificationList.franchise.name);
            setValue('franchise_id', notificationList.franchise.id);
            setValue('franchise_name', notificationList.franchise.name);
        }
        if (notificationList && notificationList.schedule_date_time) {
            setTime(moment(notificationList.schedule_date_time));
            console.log("Updated time state with schedule_date_time:", moment(notificationList.schedule_date_time));
        }


    }, [notificationList, setValue]);





    // const ChangeStatus = useCallback((e: any) => {
    //     const { value } = e.target;
    //     setStatusSelect(value)
    // }, [])

    const ChangeStatus = useCallback((e: any) => {
        const { value } = e.target;
        setStatusSelect(value);
        setValue('app_target', value, { shouldValidate: true });
        if (value) {
            clearErrors('app_target');
        }
    }, [setValue, clearErrors]);

    return (
        <Box>
            <CustomBox title="Notification Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.title}
                            fieldName="title"
                            placeholder={``}
                            fieldLabel={"Title"}
                            disabled={false}
                            view={view ? true : false}

                        />
                    </Grid>
                    <Grid item xs={12} lg={6} >
                        <CustomTextarea
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Description"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomDateTimePicker
                            values={time} 
                            changeValue={(value: any) => OnChangeDate(value)}
                            fieldName='schedule_date_time'
                            control={control}
                            error={errors.schedule_date_time}
                            fieldLabel={'Schedule Date & Time'}
                        />
                    </Grid>






                    <Grid item xs={12} lg={2} >
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="image_link"
                            placeholder={``}
                            fieldLabel={"Image Link"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.app_target}
                            fieldName="app_target"
                            placeholder={``}
                            fieldLabel={"App Target"}
                            selectvalue={notificationList?.app_target}
                            height={40}
                            label={''}
                            size={16}
                            value={statusSelect}
                            options={''}
                            onChangeValue={ChangeStatus}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled>
                                <em>Choose App Target</em>
                            </MenuItem>
                            {statusChange.map((res: any) => (
                                <MenuItem key={res.value} value={res.value}>{res.name}</MenuItem>
                            ))}
                        </Customselect>

                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="product_url"
                            placeholder={``}
                            fieldLabel={"Product Opening URL"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>



                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type="text"
                            control={control}
                            error={errors.franchise_id}
                            fieldName="franchise_id"
                            placeholder={``}
                            fieldLabel={"Franchisee"}
                            selectvalue={selectedValue}
                            height={40}
                            label={""}
                            size={16}
                            value={selectedValue}
                            onChangeValue={handleFranchiseSelect}
                            background={"#fff"}
                            disabled={view ? true : false}
                            options={franchiseList}
                        >
                            {franchiseList.map((franchise) => (
                                <MenuItem
                                    key={franchise._id}
                                    value={franchise._id}
                                >
                                    {franchise?.franchise_name}
                                </MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox
                            isChecked={instantBlock}
                            label=""
                            onChange={CheckBlackList}
                            title="Instant"
                        />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox
                            isChecked={notificationBlock}
                            label=""
                            onChange={CheckBlackLists}
                            title="Notification Sound"
                        />
                    </Grid>
                </Grid>
            </CustomBox>


            {!view && (
                <Box py={3}>
                    <Custombutton
                        btncolor=""
                        IconEnd={""}
                        IconStart={""}
                        endIcon={false}
                        startIcon={false}
                        height={""}
                        label={resData ? "Update" : "Add Notification"}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default PushNotificationForm;
