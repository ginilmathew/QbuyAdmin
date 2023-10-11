
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Stack, Typography } from '@mui/material';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import moment from 'moment'
import CustomDelete from '@/Widgets/CustomDelete';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });


const fetcher = (url: any) => fetchData(url).then((res) => res);
const CategoryManagement = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/category/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);


    const router = useRouter()

    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [pending, startTransition] = useTransition();
    const [serachList, setSearchList] = useState<any>([])

    useEffect(() => {
        if (data?.data?.data) {
            setCategoryList(data?.data?.data)
        }
    }, [data?.data?.data])



    const addvaendor = () => {
        router.push('/category/addCategory')

    }


    const editCategory = (id: any) => {
        router.push(`/category/edit/${id}`)
    }

    const viewCategory = (id: any) => {
        router.push(`/category/view/${id}`)
    }


    const columns: GridColDef[] = [
        {
            field: 'Dated Added',
            headerName: 'Date Added',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'name',
            headerName: 'Category Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'order_number',
            headerName: 'Order',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                        onClick={() => viewCategory(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => editCategory(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                </Stack>
            )
        }
    ];



    // const fetchCategoryList = useCallback(async () => {
    //     try {
    //         setLoading(true)
    //         const response = await fetchData(`/admin/category/list/${process.env.NEXT_PUBLIC_TYPE}`)
    //         setCategoryList(response?.data?.data)
    //         setSearchList(response?.data?.data)
    //     }
    //     catch (err: any) {
    //         setLoading(false)
    //         toast.error(err)
    //     }
    //     finally {
    //         setLoading(false)
    //     }

    // }, [categoryList])


    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) => com?.name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setCategoryList(Results)
        })
    }, [categoryList])


    // useEffect(() => {
    //     fetchCategoryList()
    // }, [])


    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='Category Management' onClick={addvaendor} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

        </Box>
    }

    if (error) {
        toast.error(error?.message)
    }

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='Category Management' onClick={addvaendor} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={categoryList ? categoryList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Category'
                paragraph='category'
                _id={_id}
                setData={setCategoryList}
                data={categoryList}
                url={`/admin/category/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default CategoryManagement