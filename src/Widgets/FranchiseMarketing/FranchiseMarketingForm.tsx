import { FormInputs } from '@/utilities/types';
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Divider, Grid, MenuItem } from '@mui/material'
import CustomInput from '@/components/CustomInput';
import CustomBox from '../CustomBox';
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTextarea from '@/components/CustomTextarea';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchData, postData } from '@/CustomAxios';
import CustomTimepicker from '@/components/CustomTimepicker';
import moment from 'moment';

type props = {
    res?: any,
    view?: any,

}
type IFormInput = {

    promotion_description: string,
    promotion_amount: string,
    start_date: string,
    franchise: any,
    end_date: string
}
const FranchiseMarketingForm = ({ res, view }: props) => {
    const router = useRouter()
    const { id }: any = router.query;

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [franchiseList, setFranchiseList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);
    const [type, setType] = useState<any>(null)



    const orderValidation = /^[0-9]*$/
    const schema = yup
        .object()
        .shape({
          

            start_date: yup
                .string()
                .required('Required'),
            end_date: yup
                .string()
                .required('Required'),
            promotion_amount: yup
                .string().matches(orderValidation, 'Not Valid')
                .required('Required'),
            franchise: yup.object().shape({

            }).nullable()

                .required('Required'),
        })

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue,
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
        defaultValues: {

        }
    });


    useEffect(() => {
        const getFranchiseList = async () => {
            try {
                setLoading(true)
                const response = await fetchData('/admin/franchise/list')
                setFranchiseList(response?.data?.data)

            } catch (err: any) {
                toast.error(err?.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }

        getFranchiseList()
    }, [])


    useEffect(() => {
        if (id) {
            const singleList = async () => {
                try {

                    let resp = await fetchData(`admin/franchise-marketing/show/${id}`)
              
                    const data = resp?.data?.data
                    console.log({data})
                    setFranchiseSelect(data?.franchise?.id)
                  
                        // setEndDate(data?.end_date)
                        // setStartDate(data?.start_date)
                    data.start_date = data?.start_date?  moment(data?.start_date, 'YYYY-MM-DD') : null
                    data.end_date = data?.end_date?  moment(data?.end_date, 'YYYY-MM-DD') : null
                    delete data?._id
                    delete data?.updated_at
                    delete data?.created_at
                    reset(data)
                    


                } catch (err: any) {

                } finally {

                }
            }

            singleList()

        }
    }, [id])
    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let { _id: id, franchise_name: name } = franchiseList?.find((res: any) => res?._id === e.target.value);

        setValue('franchise', { id, name })
  
        setError('franchise', { message: '' })
        setFranchiseSelect(e.target.value)
       

    }



    class DateFilter {
        static startDate(value: any) {
            // let val = moment(value).format('YYYY-MM-DD')
            setValue('start_date', value)
            setStartDate(value)
            setError('start_date', { message: "" })
        }

        static endDate(value: any) {
            // let val = moment(value).format('YYYY-MM-DD')
            setValue('end_date', value)
            setEndDate(value)

            setError('end_date', { message: "" })
        }
    }

    const submit = async (data: any) => {
        data.start_date = data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : null;
        data.end_date = data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : null;
        const CREATE = 'admin/franchise-marketing/create'
        const UPDATE = 'admin/franchise-marketing/update'

        if (res) {
            data.id = id;
        }
        try {

            await postData(res ? UPDATE : CREATE, data)
            toast.success(res ? "Updated Successfully" : "Created Successfully");
            router.back()

        } catch (err: any) {
            toast.error(err?.messsage);
        } finally {

        }

    }



    return (
        <Box>
            <CustomBox title='Franchise Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.franchise}
                            fieldName="franchise"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={franchiseSelect}
                            options={''}
                            onChangeValue={onselectFranchise}
                            background={'#fff'}
                        >
                            <MenuItem value="" disabled >
                                <>Select Franchise</>
                            </MenuItem>
                            {franchiseList && franchiseList?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
                                <MenuItem value={res?._id}>{res?.franchise_name}</MenuItem>
                            ))}
                        </Customselect>

                    </Grid>

                  
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.promotion_amount}
                            fieldName="promotion_amount"
                            placeholder={``}
                            fieldLabel={"Promotion Amount"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item lg={2} xs={12}>
                        <CustomDatePicker
                          
                            fieldName={"start_date"}
                            control={control}
                            error={errors?.start_date}
                            past={false}
                            fieldLabel={"Start Date"}
                            values={startDate}
                            changeValue={(date) => DateFilter.startDate(date)} />

                    </Grid>
                    <Grid item lg={2} xs={12}>
                        <CustomDatePicker
                            fieldName={"end_date"}
                            control={control}
                            error={errors?.end_date}
                            past={false}
                            fieldLabel={'End Date'}
                            values={endDate}
                            changeValue={(date) => DateFilter.endDate(date)} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <CustomTextarea
                            control={control}
                            error={errors.promotion_description}
                            fieldName="promotion_description"
                            placeholder={``}
                            fieldLabel={"Promotion Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>

            </CustomBox>
           {!view && <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? 'Update Details' : 'Add Details'} onClick={handleSubmit(submit)} />
            </Box> }



        </Box>
    )
}

export default FranchiseMarketingForm
