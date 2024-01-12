import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { Box, Grid, MenuItem } from '@mui/material';
import { fetchData, postData } from '@/CustomAxios';
import Customselect from '@/components/Customselect';
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import CustomHeaderBack from '@/Widgets/CustomHeaderBack';
import CustomBox from '@/Widgets/CustomBox';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTimepicker from '@/components/CustomTimepicker';
import CustomTextarea from '@/components/CustomTextarea';
import moment from 'moment';

const CreateExtraCharge = () => {
    const router = useRouter()

    type IFormInput = {
        name: any,
        description: string,
        type: string,
        label1: any,
        label2: any,
        fromDate: any,
        toDate: any,
        startTime: any,
        endTime: any,
        text: any,
        charge: any

    }
    const [selectType, setSelectType] = useState<any>('')


    let valiation1 = {
        name: yup.string().required('Required'),
        description: yup.string().required('Required'),
        label1: yup.string().required('Required'),
        label2: yup.string()
            .required('Required'), // If selectType is not 'text', label2 is required

        type: yup.string().required('Required'),
    }
    let valiation2 = {
        name: yup.string().required('Required'),
        description: yup.string().required('Required'),
        label1: yup.string().required('Required'),
        // If selectType is not 'text', label2 is required

        type: yup.string().required('Required'),
    }



    const schema = yup.object().shape(selectType === "text" ? valiation2 : valiation1);



    // const [fromDate, setFromDate] = useState<any>(null)
    // const [toDate, settoDate] = useState<any>(null)
    // const [startTime, setStartTime] = useState<any>(null)
    // const [endTime, setEndTime] = useState<any>(null)
    const [type, setType] = useState<any>([
        {
            name: 'TimeRange',
            value: 'timeRange'
        },
        {
            name: 'DateRange',
            value: 'dateRange'
        },
        {
            name: 'Text',
            value: 'text'
        }
    ]
    )


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<IFormInput>({
            resolver: yupResolver(schema),
            defaultValues: {
                label2: null
            }
        },);


    const onChangeTypeSelect = (e: any) => {
        const { value } = e.target;
        setValue('type', value)
        setSelectType(value)
        setValue('label1', '')
        setValue('label2', null)
        setError('type', { message: "" })
    }


    const Submit = async (data: any) => {
        try {
            await postData('admin/extra-charge/create', data);
            toast.success("Created Successfully");
            router.back()

        } catch (err: any) {
            toast.error(err?.messsage);
        } finally {

        }

    }



    return (
        <Box px={5} py={2} pt={10} mt={0} >
            <CustomHeaderBack backlabel='Create Extra Charge' />
            <CustomBox title='Extra Charge Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.type}
                            fieldName="type"
                            placeholder={``}
                            fieldLabel={"Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={selectType}
                            options={''}
                            onChangeValue={onChangeTypeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Type</>
                            </MenuItem>
                            {type && type?.map((res: any) => (
                                <MenuItem value={res?.value}>{res?.name}</MenuItem>
                            ))}
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.label1}
                            fieldName="label1"
                            placeholder={``}
                            fieldLabel={"Label1"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    {selectType !== "text" &&
                        <Grid item xs={12} lg={2}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.label2}
                                fieldName="label2"
                                placeholder={``}
                                fieldLabel={"Label2"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>}

                    <Grid item xs={12} lg={4}>
                        <CustomTextarea
                            // type='text'
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <Box py={3}>
                <Custombutton
                    btncolor=""
                    IconEnd={""}
                    IconStart={""}
                    endIcon={false}
                    startIcon={false}
                    height={""}
                    label={"Save"}
                    onClick={handleSubmit(Submit)}
                />
            </Box>

        </Box>
    )
}

export default CreateExtraCharge