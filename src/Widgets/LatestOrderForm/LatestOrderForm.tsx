import { fetchData } from '@/CustomAxios'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTextarea from '@/components/CustomTextarea'
import CustomTable from '@/components/CustomTable'
type IFormInput = {
    customer_email: any,
    customer_group: string,
    customer_mobile: any,
    customer_name: any,
    order_id: any,
    completed_date: string,
    pickedup_date: any,
    rider_name: string,
    rider_rating: string,
    rider_review: string
}

const LatestOrderForm = () => {

    const router = useRouter()
    const { id } = router.query
    const [itemStore, setItemStore] = useState([])
    const [itemProduct, setItemProduct] = useState([])
    console.log({itemStore})
    console.log({itemProduct})


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


    const columnsStore: GridColDef[] = [
        {
            field: 'store_id',
            headerName: 'Store ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'store_name',
            headerName: 'Store Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'franchise',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            // valueGetter: (params) => params.row.stores?.store_name
        },

        {
            field: 'store_rating',
            headerName: 'Rate Given',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'store_review',
            headerName: 'Feedback',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },




    ];

    const columnsProduct: GridColDef[] = [
        {
            field: 'product_id',
            headerName: 'Product Id',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'product_name',
            headerName: 'Product Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'product_price',
            headerName: 'Product Price',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'product_quantity',
            headerName: 'Product Quantity',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
          
        },

        {
            field: 'product_rating',
            headerName: 'Product Rating',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'product_review',
            headerName: 'Product Review',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

     


    ];

    useEffect(() => {
        const getList = async () => {
            try {
                const resp = await fetchData(`admin/customer-review/show/${id}`);
                let data = resp?.data?.data;
                data.customer_name = data?.customer_details?.customer_name;
                data.customer_email = data?.customer_details?.customer_email;
                data.customer_group = data?.customer_details?.customer_group;
                data.customer_mobile = data?.customer_details?.customer_mobile;
                data.completed_date = data?.rider_review?.completed_date;
                data.pickedup_date = data?.rider_review?.pickedup_date;
                data.rider_name = data?.rider_review?.rider_name;
                data.rider_rating = data?.rider_review?.rider_rating;
                data.rider_review = data?.rider_review?.rider_review;
                setItemProduct(data?.product_review)
                setItemStore(data?.store_review)
                delete data.customer_details
                delete data.store_review
                delete data.product_review
                // delete data.rider_review
            
                reset(data)
            } catch (err: any) {
                toast.error(err.message)

            } finally {

            }
        }
        getList()

    }, [])




    return (
        <Box>
            <CustomBox title='Customer Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_name}
                            fieldName={"customer_name"}
                            placeholder={``}
                            fieldLabel={"Customer Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_email}
                            fieldName={"customer_email"}
                            placeholder={``}
                            fieldLabel={"Customer Email"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_mobile}
                            fieldName={"customer_mobile"}
                            placeholder={``}
                            fieldLabel={"Customer Mobile"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.customer_group}
                            fieldName={"customer_group"}
                            placeholder={``}
                            fieldLabel={"Customer Group"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>

                </Grid>

            </CustomBox>
            <CustomBox title='Store & Feedback'>
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columnsStore} rows={itemStore} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>
            <CustomBox title='Product & Feedback'>
                <Box py={5}>
                    <CustomTable rowheight={80} dashboard={false} columns={columnsProduct} rows={itemProduct} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </CustomBox>
            <CustomBox title='Rider Feedback'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.rider_name}
                            fieldName={"rider_name"}
                            placeholder={``}
                            fieldLabel={"Rider Name"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.rider_rating}
                            fieldName={"rider_rating"}
                            placeholder={``}
                            fieldLabel={"Rider Rating"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.pickedup_date}
                            fieldName={"pickedup_date"}
                            placeholder={``}
                            fieldLabel={"Pickedup Date"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.completed_date}
                            fieldName={"completed_date"}
                            placeholder={``}
                            fieldLabel={"Completed Date"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <CustomTextarea
                            // type='text'
                            control={control}
                            error={errors.rider_review}
                            fieldName="rider_review"
                            placeholder={``}
                            fieldLabel={"Rider Review"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
        </Box>
    )
}

export default LatestOrderForm