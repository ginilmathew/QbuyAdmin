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




type props = {
    resData?: any;
    view?: boolean;
};

type IFormInput = {
    order_id: string;
    name: string;
    mobile: string;
    complaint: string;
    status: string;
    comments: string
}


const CustomerComplaintForm = ({ resData, view }: props) => {

    const router = useRouter()
    const { id } = router.query

    const [type, settype] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [complaintList, setComplaintList] = useState<any>([]);

    const schema = yup
        .object()
        .shape({
            comments: yup.string().required('Required'),
            status: yup.string().required('Required')


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
        const { value } = e.target;
        settype(value);
        setValue('status', value)

    }



    // ...
    useEffect(() => {
        if (id) {
            const complaintview = async () => {
                try {
                    setLoading(true);
                    const response = await fetchData(
                        `admin/customer-complaints/show/${id}`);
                    setValue("mobile", response?.data?.data?.user?.mobile);
                    setValue("name", response?.data?.data?.user?.name);
                    setValue("order_id", response?.data?.data?.order_id);
                    setValue("status", response?.data?.data?.status);
                    setValue('complaint',response?.data?.data?.complaint)
                    setValue('comments',response?.data?.data?.comments)
                    settype(response?.data?.data?.status)
                } catch (err: any) {
                    toast.error(err.message);
                } finally {
                    setLoading(false);
                }
            };
            complaintview()

        }
    }, [id]);



    const onSubmit = async (data: any) => {

        console.log({ data })

        let payload = {
            comments: data?.comments,
            id: id,
            status: data?.status
        }

        try {
            setLoading(true);

            const response = await postData("admin/customer-complaints/update", payload);
            console.log(response);
            toast.success("Updated Successfully");
            router.back()
        } catch (err: any) {

            toast.error(err?.messsage);
        } finally {
            setLoading(false);
        }
    };





    return (
        <Box>
            <CustomBox title="Complaint Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors?.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name "}
                            disabled={false}
                            view={true}
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
                            view={true}
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
                            view={true}
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
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>

                </Grid>
                <Box my={3}>
                    <Divider />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            disabled={view ? true : false}
                            type="text"
                            control={control}
                            error={errors.status}
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
                                <MenuItem key={option.value} value={option.name}>
                                    {option.value}
                                </MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={6} >
                        <CustomTextarea
                            control={control}
                            error={errors.comments}
                            fieldName="comments"
                            placeholder={``}
                            fieldLabel={"Comments"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={""}
                        />
                    </Grid>
                </Grid>

                {resData && <Box py={2} display={'flex'} justifyContent={'flex-end'}>
                    <Custombutton
                        btncolor=""
                        IconEnd={""}
                        IconStart={""}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={"Update Status"}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box>}

            </CustomBox>




        </Box>
    );
};

export default CustomerComplaintForm;
