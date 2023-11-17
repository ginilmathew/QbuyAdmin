
import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);
const SubCategory = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/subcategory/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [subCategoryList, setSubCategoryList] = useState<any>([])
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();


    useEffect(() => {
        if (data?.data?.data) {
            setSubCategoryList(data?.data?.data)
        }
    }, [data?.data?.data])



    const addSubCategory = () => {
        router.push('/subCategory/addSubCategory')
    }

    const editSubCategory = (id: string) => {
        router.push(`/subCategory/edit/${id}`)
    }

    const viewSubCategory = (id: string) => {
        router.push(`/subCategory/view/${id}`)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    // const fetchsubCategory = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await fetchData(`admin/subcategory/list/${process.env.NEXT_PUBLIC_TYPE}`)
    //         setSubCategoryList(response?.data?.data)
    //         setSearchList(response?.data?.data)
    //     } catch (err: any) {
    //         toast.error(err.message)
    //         setLoading(false)
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // }



    // useEffect(() => {
    //     fetchsubCategory()
    // }, [])


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
            field: 'category',
            headerName: 'Category',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.category?.name,

        },
        {
            field: 'name',
            headerName: 'SubCategory',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        // {
        //     field: 'order_number',
        //     headerName: 'Order',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center',
        // },
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                        onClick={() => viewSubCategory(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => editSubCategory(row?._id)}
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


    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) => com?.name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setSubCategoryList(Results)
        })
    }, [subCategoryList]);


    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='SubCategory' onClick={addSubCategory} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} id={"id"} loading={true} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

        </Box>
    }

    if(error){
        toast.error(error?.message);
    }



    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='SubCategory' onClick={addSubCategory} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={subCategoryList ? subCategoryList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='SubCategory'
                paragraph='subCategory'
                _id={_id}
                setData={setSubCategoryList}
                data={subCategoryList}
                url={`/admin/subcategory/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default SubCategory
