import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Box, Grid, Stack } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from '@/components/CustomInput'
import Custombutton from '@/components/Custombutton';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import CustomDelete from '@/Widgets/CustomDelete';






const ProductTags = () => {

    const [ loading, setLoading ] = useState(false)
    const [open, setOpen] = useState(false)
    const [id, setId] = useState('')
    const [datas, setDatas] = useState([])



    useEffect(() => {
        getAllTags()
    }, [])


    const getAllTags = async() => {
        setLoading(true)
        try {
            setLoading(true)
            const response = await fetchData('admin/tag/list')
            let { data } = response?.data
            setDatas(data)
            
        } catch (err) {
            toast.error(err?.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }
    }
    

    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Tag Name Required')
        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue, } = useForm({
            resolver: yupResolver(schema),
            defaultValues: {
                name: ''
            }
        });


    const handleOpen = (id) => {
        setId(id)
        setOpen(true)
    }

    const onSubmit = async(data) => {
        setLoading(true)
        try {
            setLoading(true)
            const response = await postData('admin/tag/create', data)
            getAllTags()
            reset()
            
        } catch (err) {
            toast.error(err?.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const columns = [
        {
            field: 'tag_id', headerName: '#', headerAlign: 'center',
            align: 'center',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Tag Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <DeleteOutlineOutlined
                        onClick={() => handleOpen(row?._id)}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }}
                    />
                </Stack>
            )
        }
    ];


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader Headerlabel='Product Tags' />
                <Box py={3}>
                    <Grid container gap={4}>
                        <Grid xs={12} md={4}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.name}
                                fieldName="name"
                                placeholder={`Tag Name`}
                                fieldLabel={"Tag Name"}
                            />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Box py={3}>
                                <Custombutton
                                    disabled={loading}
                                    btncolor=''
                                    IconEnd={''}
                                    IconStart={''}
                                    endIcon={false}
                                    startIcon={false}
                                    height={''}
                                    label={"SAVE"}
                                    onClick={handleSubmit(onSubmit)} 
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    
                    <CustomTable dashboard={false} columns={columns} rows={datas} id={"_id"} bg={"#ffff"} label='Product Tags' />
                    {open && <CustomDelete
                        heading='tag?'
                        paragraph='tag'
                        _id={id}
                        setData={setDatas}
                        data={datas}
                        url={`admin/tag/delete/${id}`}
                        onClose={handleClose}
                        open={open} 
                    />}
                </Box>
            </Box>
        </Box>
    )
}

export default ProductTags