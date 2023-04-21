import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import CustomDelete from '@/Widgets/CustomDelete';

const SubCategory = () => {
    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [subCategoryList, setSubCategoryList] = useState<any>([])
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();




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


    const fetchsubCategory = async () => {
        try {
            setLoading(true)
            const response = await fetchData('admin/subcategory/list')
            setSubCategoryList(response?.data?.data)
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        fetchsubCategory()
    }, [])


    const columns: GridColDef[] = [
        {
            field: 'Dated Added',
            headerName: 'Dated Added',
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
        let Results = serachList?.filter((com: any) => com?.name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setSubCategoryList(Results)
        })
    }, [subCategoryList])

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='SubCategory' onClick={addSubCategory} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={subCategoryList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
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
