import CustomTable from '@/components/CustomTable'
import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box, Stack } from '@mui/material'
import React, { useState, useEffect, useTransition, useCallback } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import CustomDelete from '@/Widgets/CustomDelete';

const Franchise = () => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();


     console.log({franchiseList})

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const EditFranchise = (id: any) => {

        router.push(`/franchise/edit/${id}`)

    }

    const viewFranchise = (id: any) => {
        router.push(`/franchise/view/${id}`)

    }

    const columns: GridColDef[] = [
        {
            field: 'franchise_id',
            headerName: 'Franchise ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'franchise_name',
            headerName: 'Franchise Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'owner_name',
            headerName: 'Owner.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Contact No.',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'address',
            headerName: 'Address',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'status',
            headerName: 'Status',
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
                        onClick={() => viewFranchise(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => EditFranchise(row?._id)}
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

    const addvaendor = () => {
        router.push('/franchise/addFranchise')
    }

    const getFranchiseList = async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/franchise/list')
            setFranchiseList(response?.data?.data)
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }



    const searchfranchise = (value: any) => {
        let Results = serachList?.filter((com: any) => com?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.franchise_id.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setFranchiseList(Results)
        })
    }


    useEffect(() => {
        getFranchiseList()
    }, [])


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchfranchise} addbtn={true} imprtBtn={false} Headerlabel='Franchise' onClick={addvaendor} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={franchiseList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

            {open && <CustomDelete
                _id={_id}
                setData={setFranchiseList}
                data={franchiseList}
                url={`/admin/category/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default Franchise
