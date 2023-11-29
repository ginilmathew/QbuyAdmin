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

type RiderList = {
    rider_id: string;
    name: string;
    mobile: string;
    status: string;
    reason: string;
};

type props = {
    resData?: any;
    view?: any;
};

type IFormInput = {
    rider_id: string;
    name: string;
    mobile: string;
    status: string;
    reason: string;
}
type FormData = {
    reason: string;
    status: string;
  };

const RiderLifecycleForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;
    const schema = yup
    .object()
    .shape({
    
      reason: yup.string().required('Reason is Required'),
      status: yup.string().required("Status is required"),
    
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
      } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
          reason: "",
          status: "",
        },
      });

    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [customerView, setCustomerView] = useState<any>(null);
    const [customerBlock, setCustomerBlock] = useState<boolean>(false);
    const [customerAddress, setCustomerAddress] = useState<boolean>(false);
    const [riderList, setRiderList] = useState<any>([]);
    console.log({riderList},'riderlist')
    const [loader, setLoader] = useState<boolean>(false);
    const [groupID, setGroupID] = useState<any>("");
    const router = useRouter();
    const [categoryList, setCategoryList] = useState<any>([]);
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [categories, setCategories] = useState<string[]>([]);
    const [statusSelect, setStatusSelect] = useState<string | null>(null);
    const [riderInfo, setRiderInfo] = useState<RiderList | null>(null);
 

    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Changed By',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.users?.name || '',
        },
        {
            field: 'created_at',
            headerName: 'Changed On',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.created_at, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")

        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'reason',
            headerName: 'Reason',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

    ];

    const [statusChange, setStatusChange] = useState<any>(
        [
            { value: 'active', name: 'active' },
            { value: 'inactive', name: 'inactive' },
            { value: 'terminated', name: 'terminated' }
        ])


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log("onSubmit function is called");
        setLoading(true);

        try {
            console.log("Submitting data:", data);
            const formData = new FormData();

            formData.append("rider_id", idd);
            formData.append("status", data.status);
            formData.append("reason", data.reason);

            const URL_UPDATE = "/admin/rider-lifecycle/update";

            console.log("Sending request to:", URL_UPDATE);

            const response = await postData(URL_UPDATE, formData);
            console.log({ response }, 'listvalue');

            if (response.status === 201 || response.status === 200) {
                toast.success("Rider status updated successfully");
                reset();
                router.push("/riderLifecycle");
            } else {
                toast.error("Failed");
            }
        } catch (error) {
            toast.error("An error occurred while updating the rider status");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };




    const riderview = async () => {
        try {
            setLoading(true);
            const response = await fetchData(
                `admin/rider-lifecycle/show/${idd}`
            );
            console.log({ response }, "datavalue")
            reset(response?.data?.data);
            setRiderList(response?.data?.data);
            if (response?.data?.data?.rider_life_cycle_log) {
                setRiderList(response.data.data.rider_life_cycle_log);
            }
        } catch (err: any) {
            toast.error(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idd) {
            riderview();
        }
    }, [idd]);

    useEffect(() => {
        if (riderList && idd) {
            const { rider_id, name, mobile, status, reason} = riderList;
            setRiderInfo({ rider_id, name, mobile, status, reason });
        }
    }, [riderList, idd]);


    
    const ChangeStatus = useCallback((e: React.ChangeEvent<{ value: string }>) => {
        const { value } = e.target;
        setStatusSelect(value);
        setValue("status", value);
    }, [setValue]);
    
    return (
        <Box>
            <CustomBox title="Rider Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="rider_id"
                            placeholder={``}
                            fieldLabel={"Rider ID"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={riderInfo?.rider_id || ""}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Rider Name"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={riderInfo?.name || ""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={''}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={riderInfo?.mobile || ""}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            {!view &&
            <CustomBox title="Lifecycle Status">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid container spacing={2}>
                        <Grid item xs={13} lg={5}>
                            <CustomTextarea
                                control={control}
                                error={errors.reason}
                                fieldName="reason"
                                placeholder={""}
                                fieldLabel={"Reason"}
                                disabled={false}
                                view={false}
                                defaultValue={""}
                            />

                        </Grid>
                        <Grid item lg={2} md={2} xs={12}>
                            <Customselect
                                disabled={view ? true : false}
                                type='text'
                                control={control}
                                error={errors.status}
                                fieldName="status"
                                placeholder={``}
                                fieldLabel={"Status "}
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



                    </Grid>

                </Box>
            </CustomBox>
}
            {!view &&
                <Box py={3}>
                    <Custombutton
                        btncolor=""
                        IconEnd=""
                        IconStart=""
                        endIcon={false}
                        startIcon={false}
                        height=""
                        label="Update Status"
                        onClick={handleSubmit(onSubmit)} 
                        disabled={loading}
                    />
                </Box>}
            <Box py={2}>
                <Divider />
            </Box>
            <CustomBox title='Lifecycle Log'>

                <Box py={3}>
                    <CustomTable
                        dashboard={false}
                        columns={columns}
                        rows={riderList}
                        id={"_id"}
                        bg={"#ffff"}
                        label='Recent Activity'



                    />
                </Box>
            </CustomBox>
        </Box>
    );
};

export default RiderLifecycleForm;
