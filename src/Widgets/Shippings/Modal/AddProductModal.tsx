import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import Customselect from '@/components/Customselect';
import { toast } from 'react-toastify';
import { fetchData, postData } from '@/CustomAxios';
import CustomSingleSearch from '@/components/CustomSingleSearch';




type props = {
    handleClose: any;
    open: boolean;


}
type Inputs = {
    name: string;
    franchisee: any;
    store: any

};

const AddProductModal = ({ handleClose, open }: props) => {

    const [productList, setProductList] = useState<any>([]);
    const [productListRes, setProductListRes] = useState<any>([]);
    const [franchise, setFranchise] = useState<any>([])
    const [vendor, setVendor] = useState<any>([]);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [franchiseSelect, setFranchiseSelect] = useState<string>(" ")
    const [vendorSelect, setVendorSelect] = useState<string>(" ")
    const [loading, setLoading] = useState<boolean>(false)

    console.log({ productList })
    const schema = yup
        .object()
        .shape({

        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {


            }

        });

    const onselectFranchise = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setFranchiseSelect(e.target.value)
        setValue('franchisee', e.target.value)
        setError('franchisee', { message: '' })
        try {
            setLoading(true)
            const response = await fetchData(`admin/vendor-list/${e.target.value}/${process.env.NEXT_PUBLIC_TYPE}`)

            setVendor(response?.data?.data)

        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        } finally {
            setLoading(false)

        }

    }



    const onSelectStore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setVendorSelect(e.target.value)
        let result = vendor?.filter((res: any) => res?._id === e.target.value).map((get: any) => (
            {
                commision: get?.additional_details ? get?.additional_details.commission : 0,
                id: get?._id,
                name: get?.store_name,
                category: get?.category_id
            }

        ))
        try {
            const response = await postData('admin/product/vendorproducts', { id: result?.[0]?.id });
            console.log({ RESPONSE: response?.data?.data })
            const Filter = response?.data?.data?.map((res: any) => ({
                label: res?.name,
                id: res?._id
            }))
            setProductListRes(response?.data?.data)
            setProductList(Filter)
        } catch (err: any) {
            toast.error(err)
        }
        setValue('store', e.target.value)
        setError('store', { message: '' })
    }

    const OnChangeProduct = useCallback((value: any) => {
       let data =  productListRes?.filter((res:any)=>res?._id === value?.id)
       console.log({data})
    }, [productListRes])

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

    useEffect(() => {
        getFranchiseList()
    }, [])

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={'lg'}
            fullWidth
        >
            <Box p={1} >
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box>

                    </Box>
                    <Box>
                        <Typography sx={{
                            fontSize: {
                                lg: 24,
                                md: 20,
                                sm: 16,
                                xs: 11,
                            },
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            fontFamily: `'Poppins' sans-serif`,
                        }}>{'Add Product'}</Typography>
                    </Box>
                    <Box onClick={handleClose}>
                        <Box
                            width={25}
                            height={25}
                            sx={{
                                backgroundColor: 'black',
                                borderRadius: 5,
                                p: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}>
                            <HighlightOffIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                    </Box>
                </Box>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={3}>
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.franchisee}
                                fieldName="franchisee"
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
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.store}
                                fieldName="store"
                                placeholder={``}
                                fieldLabel={"Store Name"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={vendorSelect}
                                options={''}
                                onChangeValue={onSelectStore}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Store</>
                                </MenuItem>
                                {vendor && vendor?.map((res: any) => (
                                    <MenuItem value={res?._id}>{res?.store_name}</MenuItem>
                                ))}
                            </Customselect>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomSingleSearch list={productList} onChangeValue={OnChangeProduct} fieldLabel='Products' />
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="name"
                                placeholder={``}
                                fieldLabel={"Product name"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="name"
                                placeholder={``}
                                fieldLabel={"Product name"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="name"
                                placeholder={``}
                                fieldLabel={"Product name"}
                                disabled={false}
                                view={true}
                                defaultValue={''}
                            />
                        </Grid>
                    </Grid>
                    <Box py={1} display={'flex'} justifyContent={'center'}>
                        <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Add'}
                            disabled={false}
                            onClick={handleClose} />
                    </Box>

                </DialogContent>
            </Box>

        </Dialog>
    )
}

export default AddProductModal