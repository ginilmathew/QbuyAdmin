import CustomTable from '@/components/CustomTable'
import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box, Stack, Typography } from '@mui/material'
import React, { useState, useEffect, useTransition, useCallback } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import CustomDelete from '@/Widgets/CustomDelete';
import CustomSwitch from '@/components/CustomSwitch';

const Franchise = () => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();


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
            headerName: 'Franchisee ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'franchise_name',
            headerName: 'Franchisee Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'owner_name',
            headerName: 'Owner',
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
            renderCell: ({ row }) => (
            <Typography
                sx={{ fontFamily: `'Poppins' sans-serif`,fontSize:14 ,color:'#939393'}}
            >{row?.mobile}</Typography>)

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
            renderCell: ({ row }) => (
                <Typography
                    sx={{ fontFamily: `'Poppins' sans-serif`,fontSize:14 ,color:'#939393'}}
                >{row?.address ? row?.address : '-'}</Typography>)
    

        },
        {
            field: 'Status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <CustomSwitch
                        changeRole={(e: any) => OnchangeCheck(e, row?._id)}
                        checked={row?.status === 'active' ? true : false}

                    />

                </Stack>
            )
        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    {row?.status === "active" ?
                        <>
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
                                }} /></> :
                        <>
                            <RemoveRedEyeIcon

                                style={{
                                    color: 'grey',

                                }} />
                            <BorderColorTwoToneIcon

                                style={{
                                    color: 'grey',

                                }}
                            />
                            <DeleteOutlineTwoToneIcon

                                style={{
                                    color: 'grey',

                                }} />
                        </>
                    }
                </Stack>
            )
        }
    ];




    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }
        try {
            setLoading(true)
            await postData('admin/franchise/status', value)
            getFranchiseList()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoading(false)

        }

    }

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
                <CustomTableHeader setState={searchfranchise} addbtn={true} imprtBtn={false} Headerlabel='Franchisee' onClick={addvaendor} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={franchiseList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

            {open && <CustomDelete
                heading='Franchisee'
                paragraph='franchisee'
                _id={_id}
                setData={setFranchiseList}
                data={franchiseList}
                url={`admin/franchise/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default Franchise
