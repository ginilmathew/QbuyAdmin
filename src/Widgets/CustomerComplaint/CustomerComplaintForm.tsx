import { Box, Grid, MenuItem, Typography, Divider } from "@mui/material";
import React, {
    startTransition,
    useCallback,
    useState,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CustomBox from "../CustomBox";
import CustomInput from "@/components/CustomInput";
import Customselect from "@/components/Customselect";
import CustomCheckBox from "@/components/CustomCheckBox";
import Custombutton from "@/components/Custombutton";
import { fetchData, postData } from "@/CustomAxios";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import CustomTextarea from '@/components/CustomTextarea';
import CustomTable from '@/components/CustomTable';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import CustomMultiselect from '@/components/CustomMultiselect';



type props = {
    resData?: any;
    view?: any;
};

type IFormInput = {
    order_id: string;
    name: string;
    mobile: string;
    complaint: string;
    status: string;
}
type FormData = {
    order_id: string;
    name: string;
    mobile: string;
    complaint: string;
    status: string;
};

const CustomerComplaintForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;
    const [type, settype] = useState<string>("");
    const [multpleArrayFoodType, setMultipleArrayFoodType] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [complaintList, setComplaintList] = useState<any>([]);
    console.log({complaintList}, 'riderlist')
    const schema = yup
        .object()
        .shape({



        })
        .required();


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue,
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
        defaultValues: {
            order_id: "",
            name: "",
            mobile: "",
            complaint: "",
            status:""
        },
    });
    const [genderOptions, setGenderOptions] = useState<any>([
        {
            value: 'Resolved',
            name: 'resolved'
        },
        {
            value: 'Processing',
            name: 'processing'
        },
        {
            value: 'Picked',
            name: 'picked'
        }
    ]);
    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedGender = e.target.value;
        settype(selectedGender);

    }


    const complaintview = async () => {
        try {
            setLoading(true);
            const response = await fetchData(
                `admin/customer-complaints/show/${idd}`
            );
            console.log({ response }, "datavalue")
            reset(response?.data?.data);
            setComplaintList(response?.data?.data);
        } catch (err: any) {
            toast.error(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

   // ...
useEffect(() => {
    if (idd) {
        complaintview();
      
        setValue("mobile", complaintList?.user?.mobile || "");
        setValue("order_id", complaintList?.order?.order_id || "");
        setValue("status", complaintList?.order?.status || "");
    }
}, [idd, complaintList, setValue]);



    // const onSubmit = async (formData: Inputs) => {
    //     setLoading(true);
    //     try {
    //         const payload = {
    //             slot_based: formData.slot_based,
    //             express_delivery: formData.express_delivery,
    //             multi_shop_charge: formData.multi_shop_charge,
    //         };
    //         const response = await postData("admin/panda-config/create", payload);
    //         console.log(response);
    //         toast.success("Panda config successfully added");
    //     } catch (err) {
    //         console.error(err);
    //         toast.error("Error creating Panda Config");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    return (
        <Box>
            <CustomBox title="Complaint Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name "}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                    
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="mobile" 
                            placeholder={``}
                            fieldLabel={"Phone Number"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}

                        />

                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="order_id"
                            placeholder={``}
                            fieldLabel={"Order ID"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={8} >
                        <CustomTextarea
                            control={control}
                            error={''}
                            fieldName="complaint"
                            placeholder={``}
                            fieldLabel={"Complaint Description"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={complaintList?.complaint || ''}
                        />
                    </Grid>

                </Grid>
                <Box my={3}>
                    <Divider />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            type="text"
                            control={control}
                            error={''}
                            fieldName="status"
                            placeholder=""
                            fieldLabel="Status"
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
                    <Grid item xs={12} lg={6} >
                        <CustomTextarea
                            control={control}
                            error={''}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Comments"}
                            disabled={false}
                            view={false}
                            defaultValue={""}
                        />
                    </Grid>
                </Grid>

                {/* <Box py={6}>
                    <Custombutton
                        btncolor=""
                        IconEnd={""}
                        IconStart={""}
                        endIcon={false}
                        startIcon={false}
                        height={"30px"}
                        label={"Update Status"}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box> */}

            </CustomBox>




        </Box>
    );
};

export default CustomerComplaintForm;
