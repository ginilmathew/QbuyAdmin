import CustomInput from '@/components/CustomInput'
import { Autocomplete, Box, Grid, MenuItem, TextField, Typography } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import { useForm, SubmitHandler } from "react-hook-form";
import Custombutton from '@/components/Custombutton';
import Customselect from '@/components/Customselect';
import { FormInputs } from '@/utilities/types';
import { fetchData, postData } from '@/CustomAxios';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelectSearch from '@/components/CustomeSelectSearch';
import _debounce from 'lodash/debounce';
import { toast } from "react-toastify";
import _ from 'lodash';
import { useRouter } from 'next/router';


type IFormInput = {
    type: any,
    image: any,
    franchise_id: any,
    user_group: any,
    users: any,
    value: any,


}

type props = {
    view?: any,
    res?: any
}
const PandaCoinsForm = ({ view, res }: props) => {

    const router = useRouter()
    const { id } = router.query

    const [type, setType] = useState(null);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [customerGroup, setCustomerGroup] = useState<any>([])
    const [franchiseSelect, setFranchiseSelect] = useState<any>(null)
    const [customerList, setCustomerList] = useState<any>([])
    const [userGroupSelect, setUserGroupSelect] = useState<any>(null)
    const [dataa, setDataa] = useState<any>('');
    const [inputValue, setInputValue] = useState<any>('');
    const [user, setUser] = useState<any>([])






    const schema = yup
        .object()
        .shape({})
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

    const onChangeCheckType = (e: any) => {
        const { value } = e.target;
        setType(value)
        setCustomerList([])
        setFranchiseSelect(null)
        setValue('franchise_id', null)
        setValue('user_group', null)
        setValue('type', value)
        setError('type', { message: '' })
    }






    useEffect(() => {
        const getList = async () => {
            try {
                const resp = await fetchData(`/admin/customer-group/${process.env.NEXT_PUBLIC_TYPE}`);
                const response = await fetchData('/admin/franchise/list');
                setFranchiseList(response?.data?.data);
                setCustomerGroup(resp?.data?.data)

            } catch (err: any) {

            }
        }
        getList()

    }, [])



    useEffect(() => {
        if (id) {
            const getList = async () => {
                try {
                    const resp = await fetchData(`admin/panda-coins/show/${id}`)
                    const data = resp?.data?.data
                    setType(data?.type)
                    setValue('type', data?.type)
                    setValue('value', data?.value)
                    console.log({ data })
                    if (data?.type === 'user') {
                        setFranchiseSelect(data?.franchise_id)
                        setValue('franchise_id', data?.franchise_id)
                        setValue('users', data?.user?.name ? data?.user?.name + data?.user?.mobile : data?.user?.mobile)

                    } else {
                        setUserGroupSelect(data?.user_group)
                        setValue('user_group', data?.user_group)
                    }
                } catch (err: any) {

                }


            }
            getList()
        }
    }, [])

    const selectFranchisChange = async (e: any) => {
        const { value } = e.target;
        setValue('franchise_id', value)
        setFranchiseSelect(value)
        try {
            const response = await postData(`admin/panda-coins/customer`, { franchise_id: value })


            setCustomerList(response?.data?.data)

        } catch (err: any) {

        }

        setError('franchise_id', { message: "" })
    }


    const selectuserGroup = (e: any) => {
        const { value } = e.target;
        setValue('user_group', value)
        setUserGroupSelect('')
        setUserGroupSelect(value)

    }






    const onChngeMUltiSerch = (values: any, newvalue: any) => {
        // newvalue.forEach((movie:any) => {
        //     console.log('Selected Movie ID:', movie._id);
        //     console.log('Selected Movie Name:', movie.name);
        //     // Perform other actions with id and name as needed
        // });
        let uniqCustomer: any[] = Array.from(new Set(newvalue));
        let result = uniqCustomer?.map((res: any) => (res?._id))

        setValue('users', result)


    }




    const submit = async (data: any) => {
        const CREATE = 'admin/panda-coins/create';
        const UPDATe = 'admin/panda-coins/update'
        if (type === "user") {
            delete data.user_group
        } else {
            delete data.franchise_id
            delete data.users
        }
        if (res) {
            data.id = id
            delete data.user_group
            delete data.franchise_id
            delete data.users
        }
        try {
            await postData(!res ? CREATE : UPDATe, data)
            toast.success(res ? 'Update Successfully ' : 'Created Successfully')
            router.back()
        } catch (err: any) {
            toast.error(err?.message)

        }

    }


    return (
        <Box>
            <CustomBox title='Panda Coin Details' >
                <Box sx={{ minHeight: 300 }}>
                    <Grid container spacing={2}>
                        {!res && <Grid item xs={12} lg={2.4}>
                            <Customselect
                                type='text'
                                disabled={view ? true : false}
                                control={control}
                                error={errors.type}
                                fieldName="type"
                                placeholder={``}
                                fieldLabel={"Type"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={type}
                                options={''}
                                onChangeValue={onChangeCheckType}
                                background={'#fff'}
                            >
                                <MenuItem value={'user'}>User</MenuItem>
                                <MenuItem value={'user group'}>User Group</MenuItem>

                            </Customselect>
                        </Grid>}
                        {(type === "user" && !res) && <Grid item xs={12} lg={2.4}>
                            <Customselect
                                disabled={view ? true : false}
                                type='text'
                                control={control}
                                error={errors.franchise_id}
                                fieldName="franchise_id"
                                placeholder={``}
                                fieldLabel={"Franchise"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={franchiseSelect}
                                options={''}
                                onChangeValue={selectFranchisChange}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Franchise</>
                                </MenuItem>
                                {franchiseList && franchiseList?.filter((act: any) => act?.status !== 'inactive').map((res: any) => (
                                    <MenuItem key={res?._id} value={res?._id}>{res?.franchise_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>}
                        {view && <Grid item xs={12} lg={2.4}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.users}
                                fieldName="users"

                                placeholder={``}
                                fieldLabel={"User"}
                                disabled={false}
                                view={view ? true : false}
                                defaultValue={''}
                            />
                        </Grid>}
                        {(type === "user" && !res && !view) && <Grid item xs={12} lg={2.4}>
                            <Typography>Users</Typography>

                            <Autocomplete
                                multiple

                                disablePortal
                                onChange={(event, newValue) => {
                                    console.log(event);
                                    onChngeMUltiSerch(event, newValue);
                                }}
                                getOptionLabel={(option: any) => option.name + option.mobile}
                                options={customerList}
                                sx={{ width: '100%', maxHeight: 120 }}
                                renderInput={(params: any) => <TextField {...params} label="Users" sx={{ height: 20 }} />}
                            />
                        </Grid>}
                        {(type === 'user group' && !res) && <Grid item xs={12} lg={2.4}>
                            <Customselect
                                disabled={view ? true : false}
                                type='text'
                                control={control}
                                error={errors.user_group}
                                fieldName=".user_group"
                                placeholder={``}
                                fieldLabel={"User Groups"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={userGroupSelect}
                                options={''}
                                onChangeValue={selectuserGroup}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Groups</>
                                </MenuItem>
                                {customerGroup && customerGroup.map((res: any) => (
                                    <MenuItem key={res?._id} value={res?._id}>{res?.name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>}
                        <Grid item xs={12} lg={2.4}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.value}
                                fieldName="value"
                                placeholder={``}
                                fieldLabel={"Value"}
                                disabled={false}
                                view={view ? true : false}
                                defaultValue={''}
                            />
                        </Grid>

                    </Grid>
                </Box>
            </CustomBox>
            {!view && <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={res ? 'Update panda Coins' : 'Add Panda Coins'} onClick={handleSubmit(submit)} />
            </Box>}

        </Box>
    )
}

export default PandaCoinsForm
