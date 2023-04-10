import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTable from '@/components/CustomTable';
import { Stack } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import moment from 'moment'
import CustomDelete from '@/Widgets/CustomDelete';


const CategoryManagement = () => {
    const router = useRouter()

    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');


    console.log({ categoryList })


    const addvaendor = () => {
        router.push('/category/addCategory')

    }

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
            field: 'type',
            headerName: 'Types',
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

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon

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

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const fetchCategoryList = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/category/list')
            setCategoryList(response?.data?.data?.data)
        }
        catch (err: any) {
            setLoading(false)
            toast.error(err)
        }
        finally {
            setLoading(false)
        }

    }, [categoryList])


    useEffect(() => {
        fetchCategoryList()
    }, [])


    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader imprtBtn={false} Headerlabel='Category Management' onClick={addvaendor} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={categoryList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
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