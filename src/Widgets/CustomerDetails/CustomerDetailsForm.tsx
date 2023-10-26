import { Box, Grid, MenuItem, Typography } from "@mui/material";
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

type Inputs = {
    name: any;
    mobile: any;
    email: any;
    customer_group_id: string;
    customer_block_status: boolean;
};

type Address = {
    address: any;
    flatno: any;
    city: any;
    landmark: any;
    pincode: any;
    category_id: string;
};

type props = {
    resData?: any;
    view?: any;
};
type CustomerGroup = {
    _id: string;
    name: string;
    customer_group_id: string;
};

type IFormInput = {
    name: any;
    email: any;
    mobile: any;
    customer_group_id: string;
    customer_block_status: boolean;
    address: any;
    flatno: any;
    city: any;
    landmark: any;
    pincode: any;
    category_id: any;
};
const CustomerDetailsForm = ({ resData, view }: props) => {
    const idd = resData ? resData : view;
    const schema = yup.object().shape({
        name: yup.string().required("Customer Name is required"),
        email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        mobile: yup.string().required("Mobile Number is required"),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),

        defaultValues: {
            name: resData?.name || "",
            email: resData?.email || "",
            mobile: resData?.mobile || "",
            customer_group_id: resData?.customer_group_id || "",
            customer_block_status: false,
            addresses: [
                {
                    address: "",
                    flatno: "",
                    city: "",
                    landmark: "",
                    pincode: "",
                    category_id: "",
                },
            ],
        },
    });

    const [loading, setLoading] = useState(false);
    const [numAddresses, setNumAddresses] = useState(1);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [datas, setDatas] = useState([]);
    const [isChecked, setIsChecked] = useState(true);
    const [customerGroupOptions, setCustomerGroupOptions] = useState<
        CustomerGroup[]
    >([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [customerView, setCustomerView] = useState<any>(null);
    const [customerBlock, setCustomerBlock] = useState<boolean>(false);
    const [customerAddress, setCustomerAddress] = useState<boolean>(false);
    const [customerList, setCustomerList] = useState<any>([]);
    console.log({customerList},'ll')
    const [loader, setLoader] = useState<boolean>(false);
    const [groupID, setGroupID] = useState<any>("");
    const router = useRouter();
    const [categoryList, setCategoryList] = useState<any>([]);
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [categories, setCategories] = useState<string[]>([]);

    const CheckBlackList = (e: any) => {
        if (!view) {
            setCustomerBlock(e);
            setValue("customer_block_status", e);
        }
    };
    const CheckCustomerList = (e: any) => {
        if (!view) {
            setCustomerAddress(e);
        }
    };
    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
    };

    const onChangeSelectCategory = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: any
    ) => {
        setValue(`addresses.${index}.category_id`, e.target.value);
        setError(`addresses.${index}.category_id`, { message: "" });
        const updatedCatgeories = [...categories];
        updatedCatgeories[index] = e.target.value;
        setCategories(updatedCatgeories);
    };

    const addAddressSection = () => {
        setNumAddresses(numAddresses + 1);
    };

    const deleteAddressSection = (indexToDelete: number) => {
        if (indexToDelete > 0) {
            setNumAddresses(numAddresses - 1);
        }
    };

    const fetchCustomerGroupOptions = async () => {
        try {
            const response = await fetchData("/admin/customer-group");
            const customerGroupData = response.data.data;
            console.log("API Response:", customerGroupData);
            setCustomerGroupOptions(customerGroupData);
        } catch (error) {
            console.error("Failed to fetch customer groups:", error);
            toast.error("Failed to fetch customer groups");
        }
    };

    useEffect(() => {
        fetchCustomerGroupOptions();
    }, []);

    const getCategoryList = async () => {
        try {
            setLoading(true);
            const response = await fetchData(`admin/category/list/${type}`);
            setCategoryList(response?.data?.data);
        } catch (err: any) {
            toast.error(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);

        try {
            console.log({ data });
            data.customer_group_id = selectedValue;

            const URL_CREATE = "/admin/customer-details/create";
            const URL_EDIT = "/admin/customer-details/update";
            const formData = new FormData();
            if (idd) {
                formData.append("id", customerList?._id);
            }
            formData.append("name", data.name);
            formData.append("mobile", data.mobile);
            formData.append("email", data.email);

            formData.append("customer_group_id", data.customer_group_id);
            formData.append(
                "customer_block_status",
                data.customer_block_status
            );
            // Collect addresses
            const addresses = [];
            for (let i = 0; i < numAddresses; i++) {
                const addressData = {
                    address: data.addresses[i].address,
                    flatno: data.addresses[i].flatno,
                    city: data.addresses[i].city,
                    landmark: data.addresses[i].landmark,
                    pincode: data.addresses[i].pincode,
                    category_id: data.addresses[i].category_id,
                };
                addresses.push(addressData);
            }
            formData.append("customer_address", JSON.stringify(addresses));

            const response = await postData(
                idd ? URL_EDIT : URL_CREATE,
                formData
            );

            if (response.status === 201 || response.status === 200) {
                toast.success(
                    idd
                        ? "Customer updated successfully"
                        : "Customer created successfully"
                );
                reset();

                router.push("/customerDetails");
            } else {
                toast.error("Failed");
            }
        } catch (error) {
            toast.error(
                "An error occurred while creating/updating the customer"
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const customerview = async () => {
        try {
            setLoading(true);
            const response = await fetchData(
                `admin/customer-details/show/${idd}`
            );
            console.log(response.data.data);
            reset(response?.data?.data);
            setCustomerList(response?.data?.data);
        } catch (err: any) {
            toast.error(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idd) {
            customerview();
        }
    }, [idd]);

    useEffect(() => {
        if (customerList && idd) {
            setValue("name", customerList?.users?.name);
            setValue("mobile", customerList?.users?.mobile);
            setValue("email", customerList?.users?.email);
            if (customerList?.customer_group_id) {
                setValue("customer_group_id", customerList?.customer_group_id);
                setSelectedValue(customerList?.customer_group_id);
            }
            if (customerList?.customer_block_status) {
                setValue(
                    "customer_block_status",
                    customerList?.customer_block_status
                );
                setCustomerBlock(customerList?.customer_block_status);
            }
        }
    }, [customerList, idd]);

    return (
        <Box>
            <CustomBox title="Basic Details">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={false}
                            defaultValue={customerView?.users?.name}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={false}
                            view={false}
                            defaultValue={""}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.email}
                            fieldName="email"
                            placeholder={``}
                            fieldLabel={"Email Address"}
                            disabled={false}
                            view={false}
                            defaultValue={""}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            type="text"
                            control={control}
                            error={errors.customer_group_id}
                            fieldName="customer_group_id"
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            selectvalue={selectedValue}
                            height={40}
                            label={""}
                            size={16}
                            value={selectedValue}
                            onChangeValue={onChangeSelect}
                            background={"#fff"}
                            options={customerGroupOptions}
                        >
                            {customerGroupOptions.map((group) => (
                                <MenuItem
                                    key={group._id}
                                    value={group.customer_group_id}
                                >
                                    {group.name}
                                </MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox
                            isChecked={customerBlock}
                            label=""
                            onChange={CheckBlackList}
                            title="Blacklist Customer"
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            {Array.from({ length: numAddresses }).map((_, index) => (
                <CustomBox
                    title={index === 0 ? "Address Details" : ""}
                    key={index}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={13} lg={5}>
                                <CustomInput
                                    key={index}
                                    type="text"
                                    control={control}
                                    error={
                                        errors.addresses &&
                                        errors.addresses[index] && (
                                            <div className="error">
                                                {
                                                    errors.addresses[index]
                                                        ?.address?.message
                                                }
                                            </div>
                                        )
                                    }
                                    fieldName={`addresses[${index}].address`}
                                    {...register(`addresses.${index}.address`)}
                                    placeholder={``}
                                    fieldLabel={" Address"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={""}
                                   
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    key={index}
                                    type="text"
                                    control={control}
                                    error={
                                        errors.addresses &&
                                        errors.addresses[index] && (
                                            <div className="error">
                                                {
                                                    errors.addresses[index]
                                                        ?.flatno?.message
                                                }
                                            </div>
                                        )
                                    }
                                    fieldName={`addresses[${index}].flatno`}
                                    {...register(`addresses.${index}.flatno`)}
                                    placeholder={``}
                                    fieldLabel={"House or Flat No"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={""}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    key={index}
                                    type="text"
                                    control={control}
                                    error={
                                        errors.addresses &&
                                        errors.addresses[index] && (
                                            <div className="error">
                                                {
                                                    errors.addresses[index]
                                                        ?.city?.message
                                                }
                                            </div>
                                        )
                                    }
                                    fieldName={`addresses[${index}].city`}
                                    {...register(`addresses.${index}.city`)}
                                    placeholder={``}
                                    fieldLabel={"City"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={""}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    key={index}
                                    type="text"
                                    control={control}
                                    error={
                                        errors.addresses &&
                                        errors.addresses[index] && (
                                            <div className="error">
                                                {
                                                    errors.addresses[index]
                                                        ?.landmark?.message
                                                }
                                            </div>
                                        )
                                    }
                                    fieldName={`addresses[${index}].landmark`}
                                    {...register(`addresses.${index}.landmark`)}
                                    placeholder={``}
                                    fieldLabel={"LandMark"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={""}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <CustomInput
                                    key={index}
                                    type="text"
                                    control={control}
                                    error={
                                        errors.addresses &&
                                        errors.addresses[index] && (
                                            <div className="error">
                                                {
                                                    errors.addresses[index]
                                                        ?.pincode?.message
                                                }
                                            </div>
                                        )
                                    }
                                    fieldName={`addresses[${index}].pincode`}
                                    {...register(`addresses.${index}.pincode`)}
                                    placeholder={``}
                                    fieldLabel={"Pincode"}
                                    disabled={false}
                                    view={false}
                                    defaultValue={""}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2.5}>
                                <Customselect
                                    key={index}
                                    disabled={view ? true : false}
                                    type="text"
                                    control={control}
                                    error={
                                        errors.addresses &&
                                        errors.addresses[index] && (
                                            <div className="error">
                                                {
                                                    errors.addresses[index]
                                                        ?.category_id?.message
                                                }
                                            </div>
                                        )
                                    }
                                    fieldName={`addresses.${index}.category_id`}
                                    {...register(
                                        `addresses.${index}.category_id`
                                    )}
                                    placeholder={``}
                                    fieldLabel={"Category"}
                                    selectvalue={""}
                                    height={40}
                                    label={""}
                                    size={16}
                                    value={categories[index] || ""} // Set the value here
                                    background={"#fff"}
                                    onChangeValue={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => onChangeSelectCategory(e, index)} // Pass index
                                    options={categoryList} // Pass the list of categor
                                >
                                    <MenuItem value="" disabled>
                                        <>Select Category</>
                                    </MenuItem>
                                    {categoryList &&
                                        categoryList?.map((res: any) => (
                                            <MenuItem
                                                key={res?._id}
                                                value={res?._id}
                                            >
                                                {res?.name}
                                            </MenuItem>
                                        ))}
                                </Customselect>
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <Typography mb={3}></Typography>
                                <CustomCheckBox
                                    isChecked={customerAddress}
                                    label=""
                                    onChange={CheckCustomerList}
                                    title="Set As Default Address"
                                />
                            </Grid>
                        </Grid>
                        <div
                            style={{
                                position: "relative",
                                top: "-93px",
                                width: "124px",
                                height: "36px",
                            }}
                        >
                            {index > 0 ? (
                                <Custombutton
                                    btncolor=""
                                    IconEnd={""}
                                    IconStart={""}
                                    endIcon={false}
                                    startIcon={false}
                                    height={"30px"}
                                    label={"Delete"}
                                    onClick={() => deleteAddressSection(index)}
                                />
                            ) : (
                                <Custombutton
                                    btncolor=""
                                    IconEnd={""}
                                    IconStart={""}
                                    endIcon={false}
                                    startIcon={false}
                                    height={"30px"}
                                    label={"Add More"}
                                    onClick={addAddressSection}
                                />
                            )}
                        </div>
                    </Box>
                </CustomBox>
            ))}

            {!view && (
                <Box py={3}>
                    <Custombutton
                        btncolor=""
                        IconEnd={""}
                        IconStart={""}
                        endIcon={false}
                        startIcon={false}
                        height={""}
                        label={resData ? "Update" : "Add Customer"}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CustomerDetailsForm;
