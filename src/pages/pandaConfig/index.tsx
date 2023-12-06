import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import CustomCheckBox from "@/components/CustomCheckBox";
import Custombutton from "@/components/Custombutton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchData, postData } from "@/CustomAxios";

type Props = {
    resData?: any;
    view?: any;
};

type Inputs = {
    slot_based: any;
    express_delivery: any;
    multi_shop_charge: string;
};

const pandaConfig = ({ resData, view }: Props) => {
    const [loading, setLoading] = useState(false);
    const [notificationBlock, setNotificationBlock] = useState<boolean>(false);
    const [expressDeliveryBlock, setExpressDeliveryBlock] = useState<boolean>(false);

    const schema = yup.object().shape({
        slot_based: yup.string().required("Slot Based Delivery is required"),
        express_delivery: yup.string().required("Express Based Delivery is required"),
        multi_shop_charge: yup.string().required("Multi Shop Charge is required"),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        setError,
        clearErrors,
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            slot_based: "",
            express_delivery: "",
            multi_shop_charge: "",
        },
    });

    const getPandaConfig = async () => {
        try {
            setLoading(true);
            const response = await fetchData("admin/panda-config/show");
            console.log({ response }, "panda");
            if (response && response.data) {
                const { slot_based, express_delivery, multi_shop_charge } =
                    response.data.data;
                setValue("slot_based", slot_based);
                setValue("express_delivery", express_delivery);
                setValue("multi_shop_charge", multi_shop_charge);
            }
        } catch (err) {
            toast.error("Error fetching Panda Config data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPandaConfig();
    }, []);

    const onSubmit = async (formData: Inputs) => {
        setLoading(true);
        try {
            const payload = {
                slot_based: formData.slot_based,
                express_delivery: formData.express_delivery,
                multi_shop_charge: formData.multi_shop_charge,
            };
            const response = await postData("admin/panda-config/create", payload);
            console.log(response);
            toast.success("Panda config successfully added");
        } catch (err) {
            console.error(err);
            toast.error("Error creating Panda Config");
        } finally {
            setLoading(false);
        }
    };

    const CheckBlackLists = (isChecked: boolean) => {
        if (!view) {
            setNotificationBlock(isChecked);
        }
    };
    const CheckExpressDelivery = (isChecked: boolean) => {
        if (!view) {
            setExpressDeliveryBlock(isChecked);
        }
    };
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Typography
                py={2}
                sx={{
                    color: "#58D36E",
                    fontFamily: `'Poppins' sans-serif`,
                    fontSize: 30,
                    fontWeight: "bold",
                }}
            >
                Panda Config
            </Typography>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}  lg={2}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <CustomInput
                                type="text"
                                control={control}
                                error={errors.slot_based}
                                fieldName="slot_based"
                                placeholder=""
                                fieldLabel={"Slot Based Delivery"}
                                view={false}
                                disabled={!notificationBlock}
                            />
                            {/* <div
                                style={{
                                    marginLeft: "-13px"
                                }}
                            >
                                <CustomCheckBox
                                    isChecked={notificationBlock}
                                    label=""
                                    onChange={(isChecked) => CheckBlackLists(isChecked)}
                                    title=""
                                />
                            </div> */}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}  lg={2}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <CustomInput
                                type="text"
                                control={control}
                                error={errors.express_delivery}
                                fieldName="express_delivery"
                                placeholder=""
                                fieldLabel={"Express Based Delivery"}
                                disabled={!expressDeliveryBlock}
                                view={false}
                            />
                            {/* <div style={{ marginLeft: "-13px" }}>
                                <CustomCheckBox
                                    isChecked={expressDeliveryBlock}
                                    label=""
                                    onChange={(isChecked) => CheckExpressDelivery(isChecked)}
                                    title=""
                                />
                            </div> */}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}  lg={2}>
                        <CustomInput
                            type="text"
                            control={control}
                            error={errors.multi_shop_charge}
                            fieldName="multi_shop_charge"
                            placeholder=""
                            fieldLabel={"Multi Shop Charge"}
                            disabled={false}
                            view={false}
                        />
                    </Grid>
                </Grid>

            </Box>

            <Box py={5}>
                <Custombutton
                    btncolor=""
                    IconEnd={""}
                    IconStart={""}
                    endIcon={false}
                    startIcon={false}
                    height={""}
                    label={"Update"}
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                />
            </Box>
        </Box>
    );
};

export default pandaConfig;
