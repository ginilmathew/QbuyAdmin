import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { Box, Grid, MenuItem } from '@mui/material';
import CustomBox from '../CustomBox';
import { fetchData, postData } from '@/CustomAxios';
import Customselect from '@/components/Customselect';
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';

type props = {
    res?: any
    view?: any
}

const CustomDeliveryCharge = ({ res, view }: props) => {

    const router = useRouter()
    const { id } = router.query;

    const [statusList, setStatus] = useState<any>(null)
    const [statusSelect, setStatusSelect] = useState(null)
    const [commentsList, setCommentsList] = useState<any>([])
    const [franchiseList, setFranchiseList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null);

    type IFormInput = {
        locality: any,
        within: string,
        normal_charge: string,
        rate_per_km: string,
        time_label: string,
        charge_name: string
        type:any

    }



    const schema = yup
        .object()
        .shape({
            locality: yup.string().required('Required'),
            within: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
            normal_charge: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
            rate_per_km: yup.string().matches(/^[0-9]+$/, 'not valid').required('Required'),
            time_label: yup.string().required('Required'),
            charge_name: yup.string().required('Required')
        })


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue, } = useForm<IFormInput>({
            resolver: yupResolver(schema),
            defaultValues:{
                type:process.env.NEXT_PUBLIC_TYPE
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
            const getSingleList = async () => {
                try {
                    setLoading(true)
                    const response = await fetchData(`admin/delivery-charge/show/${id}`)
                    response.data.data.locality = response?.data?.data?.locality?.franchise_id;
                    setFranchiseSelect(response?.data?.data?.locality)
                    reset(response?.data?.data)
                } catch (err: any) {
                    toast.error(err?.message)
                    setLoading(false)
                } finally {
                    setLoading(false)
                }
            }
            getSingleList()
        }


    }, [id])



    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {


        const { value } = e.target;

        setValue('locality', value)
        setError('locality', { message: '' })
        setFranchiseSelect(value)

    }

    const onSubmit = async (data: any) => {
        let { _id: franchise_id, franchise_name } = franchiseList?.find((res: any) => res?._id === franchiseSelect);
        data.locality = { franchise_id, franchise_name }
        if (res) {
            data.id = id;
        }
        try {
            const CREATE = 'admin/delivery-charge/create';
            const UPDATE = 'admin/delivery-charge/update';
            await postData(res ? UPDATE : CREATE, data)
            toast.success(res ? 'Update Successfully' : 'Created Successfully');
            router.back()
        } catch (err: any) {
            toast.error(err?.message)
        } finally {

        }
    }



    return (
        <Box>
            <CustomBox title='Delivery Charge Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            disabled={view ? true : false}
                            type='text'
                            control={control}
                            error={errors.locality}
                            fieldName="locality"
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
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.within}
                            fieldName="within"
                            placeholder={``}
                            fieldLabel={"Within (km)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.normal_charge}
                            fieldName="normal_charge"
                            placeholder={``}
                            fieldLabel={"Normal Charge"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.rate_per_km}
                            fieldName="rate_per_km"
                            placeholder={``}
                            fieldLabel={"Rate Per (km)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.time_label}
                            fieldName="time_label"
                            placeholder={``}
                            fieldLabel={"Time Label(10-20 min)"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.charge_name}
                            fieldName="charge_name"
                            placeholder={``}
                            fieldLabel={"Charge Name"}
                            disabled={false}
                            view={view ? true : false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
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
                        label={res ? 'Update' : 'Add Charge'}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    />
                </Box>}
        </Box>
    )
}

export default CustomDeliveryCharge