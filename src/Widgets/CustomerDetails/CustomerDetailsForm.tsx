import { Box, Grid, MenuItem, Typography } from "@mui/material";
import GoogleAutocomplete from "react-google-autocomplete";
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
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import Icon from '@mui/material/Icon';
import { CheckBox, Style } from "@mui/icons-material";
import CustomInputNormal from "@/components/CustomInputNormal";
import { log } from "console";

type Inputs = {
    name: any;
    address_mobile: any;
    email: any;
    customer_group_id: string;
    customer_block_status: boolean;
    address_name: string;

    comments: string;
    mobile: string;
    pincode: string,
    address_type: string,
};

type Address = {
    address: any;
    area: any;
    comments: any;
    pincode: any;
    address_phone: any,
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
    address_mobile: any;
    customer_group_id: string;
    customer_block_status: boolean;
    address_name: any;
    address_type: any;
    comments: any;
    mobile: any;
    pincode: any
};
const CustomerDetailsForm = ({ resData, view }: props) => {
    const router = useRouter();
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const idd = resData ? resData : view;
    const schema = yup.object().shape({
        name: yup.string().required("Customer Name  required"),

        //  address_name: yup.string().required("address Name is required"),
        // email: yup
        //     .string()
        //     .email("Invalid email")
        //     .required("Email is required"),
        //    mobile: yup.string().required('Mobile Number is Required').matches(phoneRegExp, 'Mobile number is not valid').min(10, 'Mobile Number must be minimum 10 digit').max(10, 'Mobile number is not valid'),
        address_mobile: yup.string().required('Mobile Number  Required').matches(phoneRegExp, 'Mobile number is not valid').min(10, 'Mobile Number must be minimum 10 digit').max(10, 'Mobile number is not valid'),
        // addresses: yup.array().of(
        //     yup.object().shape({
        //         address: yup.string().required("Address is required"),
        //         area: yup.string().required("area No is required"),
        //         comments: yup.string().required("comments is required"),
        //         pincode: yup.string().required("Pincode is required"),
        //         category_id: yup.string().required("Category is required"),
        //     })
        // ),
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
            address_name: resData?.address_name || "",
            address_type: resData?.address_type || "",
            comments: resData?.comments || "",
            address_mobile: resData?.mobile || "",
            pincode: resData?.pincode || "",
        },
    });
    const [addressStatus, setaddressStatus] = useState<any>(
        [
            { value: 'home', name: 'Home' }
            , { value: 'office', name: 'Office' },

        ])
    const [loading, setLoading] = useState(false);
    const [numAddresses, setNumAddresses] = useState(1);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [datas, setDatas] = useState([]);
    const [isChecked, setIsChecked] = useState(true);
    const [customerGroupOptions, setCustomerGroupOptions] = useState<
        CustomerGroup[]
    >([]);
    const [value, setvalue] = useState<any>({})
    const [selectedValue, setSelectedValue] = useState("");
    const [customerView, setCustomerView] = useState<any>(null);
    const [customerBlock, setCustomerBlock] = useState<boolean>(false);

    const [customerList, setCustomerList] = useState<any>(null);
    const [areaofcustomer, setareaofcustomer] = useState<any>({})
    const [addressfromprevious, setaddressfromprevious] = useState<any>([])

    const [categoryList, setCategoryList] = useState<any>([]);
    const [type, settype] = useState<string>(`${process.env.NEXT_PUBLIC_TYPE}`);
    const [categories, setCategories] = useState<string[]>([]);
    const [pincode, setpincode] = useState<any>("")
    const [area, setArea] = useState<any>("")
    const [statusSelect, setStatusSelect] = useState<any>(null)

    const CheckBlackList = (e: any) => {

        console.log({ customerList }, 'customerList FROM PREVIOUS')


        if (!view) {
            setCustomerBlock(e);
            setValue("customer_block_status", e);
        }
    };

    const CheckCustomerList = (e: any, i: any, mode: any) => {
        addressfromprevious[i][mode] = e;
    };

    const defaultAddress = addressfromprevious;
    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
    };

    const onChangeSelectCategory = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: any
    ) => {
        // setValue(`addresses.${index}.category_id`, e.target.value);
        // setError(`addresses.${index}.category_id`, { message: "" });
        const updatedCatgeories = [...categories];
        updatedCatgeories[index] = e.target.value;
        setCategories(updatedCatgeories);
    };

    const addAddressSection = () => {
        // setNumAddresses(numAddresses + 1);//uncommented code

        const variable = {
            id: new Date(),
            name: null,
            area: null,
            phone: null,
            address_type: null,
            pincode: null,
            Apikey: false,
            areaObject: null

            // id:itm?._id,
            // address_name:itm?.name,
            //   area:itm?.area,
            //   mobile:itm?.mobile,
            //   address_type:itm?.address_type,
            //   pincode:itm?.pincode,
            //   Apikey:true,
            //   comments:itm?.comments,
            //   default_status:itm?.default_status,



        }
        // setNumAddresses(numAddresses + 1);

        setaddressfromprevious((prv: any) => [...prv, variable])
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

            setCustomerGroupOptions(customerGroupData);
        } catch (error) {
            console.error("Failed to fetch customer groups:", error);
            toast.error("Failed to fetch customer groups");
        }
    };



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
        fetchCustomerGroupOptions();
        getCategoryList();
    }, []);


    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            data.customer_group_id = selectedValue;
            if (!addressfromprevious[0]?.pincode) {
                toast.error("Address pincode required")
                return
            }

            if (!addressfromprevious[0]?.area) {
                toast.error("Area required")
                return
            }

            if (!addressfromprevious[0]?.address_type) {
                toast.error("Address type required")
                return
            }
            const values = {
                name: data?.name,
                address_mobile: addressfromprevious[0]?.mobile,
                email: data?.email,
                customer_group_id: data.customer_group_id,
                customer_block_status: data.customer_block_status,
                address_name: addressfromprevious[0]?.address_name,
                comments: addressfromprevious[0]?.comments,
                mobile: data?.address_mobile,
                pincode: addressfromprevious[0]?.pincode,
                address_type: addressfromprevious[0]?.address_type,
                default_status: addressfromprevious[0]?.default_status,
                area: addressfromprevious[0]?.area,
            }
            await postData(
                `/admin/customer-details/create`, values
            );
            toast.success(
                "Customer created successfully"
            );
            reset();
            router.push("/customerDetails");
        } catch (error: any) {
            toast.error(error?.message)
        } finally {
            setLoading(false);

        }


        // try {

        // data.customer_group_id = selectedValue;


        //     // const URL_CREATE = "/admin/customer-details/create";
        //     // // const URL_EDIT = "/admin/customer-details/update";
        //     // const formData = new FormData();
        //     // // const addresses = [];


        //     console.log(...addressfromprevious[0],'TEXT')




        //     if (response.status === 201 || response.status === 200) {
        //         toast.success(
        //             idd
        //                 ? "Customer updated successfully"
        //                 : "Customer created successfully"
        //         );
        //         reset();


        //         router.push("/customerDetails");
        //     } else {
        //         toast.error("Failed");
        //     }
        // }
        // catch (error: any) {

        //     toast.error(error?.message)

        // } finally {
        //     setLoading(false);
        // }
    };
    const onSubmitAddress = async (data: any) => {

        const result = { ...data }
        delete result?.customer_address?.Apikey

        if (!result?.address_name) {

            toast.error("Address name is required");
            return;
        }
        if (!result?.address_type) {
            toast.error("Address type required")
            return
        }

        if (!String(result?.pincode)) {

            toast.error("Address pincode is required");
            return;
        }

        // delete result?.customer_address[0]?.created_at
        // delete result?.customer_address[0]?.customer_address_id
        // delete result?.customer_address[0]?.updated_at
        // delete result?.customer_address[0]?.status
        // delete result?.customer_address[0]?.default


        result.default_status = 1
        // result.id = "iuhiuhiu";
        console.log({ result })
        setLoading(true);



        try {

            // data.customer_group_id = selectedValue;




            const URL_EDIT = "/admin/customer-details/update-address";


            const response = await postData(
                URL_EDIT,
                result
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

    const onSubmitAddresscreate = async (data: any) => {


        const result = { ...data }

        delete result?.Apikey

        delete result?.customer_address?.id


        if (!result?.address_name) {

            toast.error("Address name is required");
            return;
        }
        if (!result?.address_type) {

            toast.error("Address type is required");
            return;
        }

        if (!result?.pincode) {

            toast.error("Address pincode is required");
            return;
        }
        // delete result?.customer_address[0]?.customer_address_id
        // delete result?.customer_address[0]?.updated_at
        // delete result?.customer_address[0]?.status
        // delete result?.customer_address[0]?.default

        result.default_status = 1
        result.user_id = customerList?.customer_address[0]?.user_id
        // result.id = "iuhiuhiu";
        console.log({ result }, 'got iD')
        setLoading(true);



        try {

            data.customer_group_id = selectedValue;
            const URL_CREATE = "/admin/customer-details/create-address";
            const URL_EDIT = "/admin/customer-details/update-address";
            const response = await postData(
                URL_CREATE,
                result
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




    const onSubmitCustomerBasicDetails = async (data: any) => {
        setLoading(true);

        try {

            data.customer_group_id = selectedValue;


            const URL_CREATE = "admin/customer-details/update";
            // const URL_EDIT = "/admin/customer-details/update";

            // const addresses = [];

            const values = {
                if(idd: any) {

                    const id = customerList?._id
                },
                name: data?.name,
                email: data?.email,
                address_mobile: data?.address_mobile,
                customer_group_id: data.customer_group_id,
                customer_block_status: data.customer_block_status,
                customer_id: customerList?._id,
                areaObject: data?.area
            }

            const response = await postData(
                `/admin/customer-details/update`, values

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
        }
        catch (error) {
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
        if (customerList) {
            let addrs = customerList?.customer_address?.map((itm: any) => (
                {
                    id: itm?._id,
                    address_name: itm?.name,
                    area: itm?.area,
                    mobile: itm?.mobile,
                    address_type: itm?.address_type,
                    pincode: itm?.pincode,
                    Apikey: true,
                    comments: itm?.comments,
                    default_status: itm?.default_status,
                    areaObject: itm?.area

                }
            )
            )
            setaddressfromprevious(addrs)
        }
    }, [customerList])





    const ChangeStatus = useCallback((e: any) => {
        const { value } = e.target;


        setStatusSelect(value)
    }, [])
    useEffect(() => {


        if (customerList && idd) {
            setValue("name", customerList?.users?.name);
            setValue("address_mobile", customerList?.users?.mobile);
            setValue("email", customerList?.users?.email);

            if (customerList?.customer_group_id) {
                setValue("customer_group_id", customerList?.customer_group_id);
                setSelectedValue(customerList?.customer_group_id);
            }

            setValue("customer_block_status", customerList?.customer_block_status);
            setCustomerBlock(customerList?.customer_block_status);

            if (customerList?.customer_block_status) {
                setValue(
                    "customer_block_status",
                    customerList?.customer_block_status
                );
                setCustomerBlock(customerList?.customer_block_status);
            }


        }
    }, [customerList, idd]);



    const handleAreaChange = (e: any) => {
        const value = e.target.value;
        setArea(e.target.value)


    }
    const handlePlaceSelected = (place: any, i: any, mode: any) => {
        const area = {
            address: place?.formatted_address,
            location: place?.formatted_address,
            latitude: place?.geometry.location.lat(),
            longitude: place?.geometry.location.lng(),

        }
        // setareaofcustomer(area)
        addressfromprevious[i][mode] = area;
        addressfromprevious[i]["areaObject"] = place

        console.log({ addressfromprevious });



    };
    const allDetailsChange = (e: any, index: any, key: any) => {


        const { value } = e.target

        addressfromprevious[index][key] = value;





    }


    const addAddressSectionSingle = () => {
        // setNumAddresses(numAddresses + 1);//uncommented code

        const variable = {
            id: new Date(),
            name: null,
            area: null,
            phone: null,
            address_type: null,
            pincode: null,
            Apikey: false,
            default_status: false
        }
        // setNumAddresses(numAddresses + 1);

        setaddressfromprevious([variable])
    };





    addressfromprevious?.map((addres: any, i: any) => (
        console.log({ addressfromprevious })
    ))
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
                            error={errors.address_mobile}
                            fieldName="address_mobile"
                            placeholder={``}
                            fieldLabel={"Mobile Number"}
                            disabled={resData ? true : false}
                            view={resData ? true : false}
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
                            defaultValue={""}
                            size={16}
                            value={selectedValue}
                            onChangeValue={onChangeSelect}
                            background={"#fff"}
                            options={customerGroupOptions}
                        >
                            {customerGroupOptions.map((group) => (
                                <MenuItem
                                    key={group._id}
                                    value={group._id}
                                >
                                    {group.name}
                                </MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox
                            isChecked={customerBlock ? true : false}
                            label=""
                            onChange={CheckBlackList}
                            title="Blacklist Customer"
                        />
                    </Grid>
                    {!view && resData && (
                        <Box py={3}>
                            <Custombutton
                                btncolor=""
                                IconEnd={""}
                                IconStart={""}
                                endIcon={false}
                                startIcon={false}
                                height={"30px"}
                                label={"Update"}
                                onClick={handleSubmit(onSubmitCustomerBasicDetails)}
                            />
                        </Box>
                    )}

                </Grid>
            </CustomBox>
            {addressfromprevious.length ? "" : <Box style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', paddingTop: '10px' }}>

                <Custombutton
                    btncolor=""
                    IconEnd={""}
                    IconStart={""}
                    endIcon={false}
                    startIcon={false}
                    height={"30px"}
                    label={"Add Address"}
                    onClick={addAddressSectionSingle}
                />
            </Box>
            }
            {addressfromprevious?.length > 0 && addressfromprevious?.map((addres: any, i: any) => (

                <>

                    <CustomBox
                        title={"Address Details"}

                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >



                            <Grid container spacing={2}>

                                <Grid item xs={12} lg={3}>
                                    {/* <CustomInput
                                   key={i}
                                   type="text"
                                   control={control}
                                   error={errors.address_name}
                                   fieldName="address_name"
                                   placeholder={``}
                                   Values={addres?.[i]?.address_name}
                                   fieldLabel={"Address"}
                                   onChangeValue={(e: any) => allDetailsChange(e,i,'address_name')}
                                   disabled={false}
                                   view={false}
                                   defaultValue={''}

                               /> */}
                                    <CustomInputNormal
                                        value={addres?.[i]?.address_name}
                                        disabled={false}
                                        type="text"
                                        error={errors.address_name}
                                        fieldName='address_name'
                                        placeholder={``}
                                        onChangeValue={(e: any) => allDetailsChange(e, i, 'address_name')}
                                        fieldLabel={'Address Name'}
                                        view={view ? true : false}
                                        defaultValue={addres?.address_name}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3}>

                                    <CustomInputNormal
                                        value={addres[i]?.pincode}
                                        disabled={false}
                                        type="text"
                                        error={errors.pincode}
                                        fieldName='pincode'
                                        placeholder={``}
                                        onChangeValue={(e: any) => allDetailsChange(e, i, 'pincode')}
                                        fieldLabel={'Pincode'}
                                        view={view ? true : false}
                                        defaultValue={addres?.pincode}
                                    />
                                </Grid>


                                <Grid item xs={12} lg={3}>

                                    <GoogleAutocomplete
                                        apiKey={process.env.NEXT_PUBLIC_GOOGLEKEY}
                                        style={{ width: "95%", height: '63%', marginTop: "23px", }}
                                        onPlaceSelected={(e: any) => handlePlaceSelected(e, i, 'area')}
                                        types={['(regions)']}
                                        defaultValue={addres?.[i]?.area?.address || defaultAddress[i]?.area?.address}
                                        selectProps={{
                                            value: addres?.[i]?.area?.address || defaultAddress[i]?.area?.address,
                                            onChange: (o: any) => {


                                                let placeId = o["value"]["place_id"];
                                                setareaofcustomer(o);
                                                // formik.setFieldValue("googlePlaceId", placeId);
                                            }
                                        }}
                                    />

                                </Grid>

                                {/* <Grid item xs={12} lg={2}>  
            <CustomInput
                                   key={index}
                                   type="text"
                                   control={control}
                                   error={errors.customer_group_id}
                                   fieldName="customer_group_id"
                                   placeholder={``}
                                   fieldLabel={"Area"}
                                   disabled={false}
                                   view={false}
                                   Values={area}
                                   onChangeValue={handleAreaChange}
                                   defaultValue={""}
                               />
                           </Grid> */}

                                <Grid item xs={12} lg={3}>

                                    <CustomInputNormal
                                        value={addres[i]?.mobile}
                                        disabled={false}
                                        type="text"
                                        error={errors.mobile}
                                        fieldName='mobile'
                                        placeholder={``}
                                        onChangeValue={(e: any) => allDetailsChange(e, i, 'mobile')}
                                        fieldLabel={'Address Mobile'}
                                        view={view ? true : false}
                                        defaultValue={addres?.mobile}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3}>

                                    <CustomInputNormal
                                        value={addres[i]?.comments}
                                        disabled={false}
                                        type="text"
                                        error={errors.comments}
                                        fieldName='comments'
                                        placeholder={``}
                                        onChangeValue={(e: any) => allDetailsChange(e, i, 'comments')}
                                        fieldLabel={'Comments'}
                                        view={view ? true : false}
                                        defaultValue={addres?.comments}
                                    />
                                </Grid>

                                <Grid item lg={3} xs={12}>
                                    <Customselect
                                        disabled={view ? true : false}
                                        type='text'
                                        control={control}
                                        error={errors.address_type}
                                        fieldName="address_type"
                                        placeholder={``}
                                        fieldLabel={"Address Type"}
                                        selectvalue={addres?.address_type}
                                        height={40}
                                        label={''}
                                        defaultValue={addres?.address_type}
                                        size={16}
                                        value={addres[i]?.address_type}
                                        options={''}
                                        onChangeValue={(e: any) => allDetailsChange(e, i, 'address_type')}
                                        background={'#fff'}
                                    >
                                        <MenuItem value="" disabled >
                                            <em>Change Status</em>
                                        </MenuItem>
                                        {addressStatus.map((res: any) => (
                                            <MenuItem value={res?.value}>{res?.name}</MenuItem>
                                        ))}
                                    </Customselect>

                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Typography mb={3}></Typography>
                                    <CustomCheckBox
                                        isChecked={addres[i]?.default}
                                        label=""
                                        onChange={(e: any) => CheckCustomerList(e, i, "default_status")}
                                        title="Set As Default Address"
                                    />
                                </Grid>
                                <div
                                    style={{
                                        position: "relative",
                                        top: "-123px",
                                        width: "124px",
                                        height: "36px",
                                        left: "96px"

                                    }}
                                >
                                    {/* {i > 0 ? (
      
        <DeleteOutlineTwoToneIcon
        onClick={() => deleteAddressSection(i)}
                        style={{
                            color: 'red',
                            cursor: 'pointer'
                        }} />
    ) : ( */}



                                    {i > 0 ? (
                                        null
                                    ) : (
                                        resData && (
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
                                        )
                                    )}

                                </div>
                                <div
                                    style={{
                                        position: "sticky",
                                        top: "-110px",
                                        width: "124px",
                                        height: "30px",
                                        marginTop: "100px"
                                    }}>


                                    {(!addres.Apikey && addressfromprevious?.length > 1) ? (
                                        <Custombutton
                                            btncolor=""
                                            IconEnd={""}
                                            IconStart={""}
                                            endIcon={false}
                                            startIcon={false}
                                            height={"30px"}
                                            label={"Save"}
                                            onClick={() => onSubmitAddresscreate(addres)}
                                        />
                                    ) : (
                                        !view && addres.Apikey && (
                                            <Custombutton
                                                btncolor=""
                                                IconEnd={""}
                                                IconStart={""}
                                                endIcon={false}
                                                startIcon={false}
                                                height={"30px"}
                                                label={"Update"}
                                                onClick={() => onSubmitAddress(addres)}
                                            />
                                        )
                                    )}
                                </div>
                            </Grid>



                        </Box>

                    </CustomBox>
                </>

            ))}

            {!view && !resData && (
                <Box py={3}>
                    <Custombutton
                        btncolor=""
                        IconEnd={""}
                        IconStart={""}
                        endIcon={false}
                        startIcon={false}
                        height={""}
                        label={resData ? "Update" : "Save"}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CustomerDetailsForm;
