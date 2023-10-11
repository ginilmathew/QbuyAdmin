import dynamic from 'next/dynamic';


const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const Box = dynamic(() => import('@mui/material/Box'), { ssr: false });
const Stack = dynamic(() => import('@mui/material/Stack'), { ssr: false });
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });
const CustomSwitch = dynamic(() => import('@/components/CustomSwitch'), { ssr: false });

import React, { useState, useEffect, useTransition, startTransition } from 'react'
import {  GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import useSWR from 'swr'



const fetcher = (url: any) => fetchData(url).then((res) => res);

const Franchise = () => {

    //console.log({user: user})

    const router = useRouter();
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const { data, error, isLoading, mutate } = useSWR('/admin/franchise/list', fetcher)


    useEffect(() => {
        if(data?.data?.data){
            setFranchiseList(data?.data?.data)
        }

        if(error){
            toast.error(error)
        }
    }, [data?.data?.data, error])
    


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
                    sx={{ fontFamily: `'Poppins' sans-serif`, fontSize: 14, color: '#939393' }}
                >{row?.mobile}</Typography>)

        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        // {
        //     field: 'address',
        //     headerName: 'Address',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center',
        //     renderCell: ({ row }) => (
        //         <Typography
        //             sx={{ fontFamily: `'Poppins' sans-serif`, fontSize: 14, color: '#939393' }}
        //         >{row?.address ? row?.address : '-'}</Typography>)


        // },
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

        //const { checked } = e.target;

 

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }
        try {
            //setLoading(true)
            const response = await postData('admin/franchise/status', value)

            mutate()

            //getFranchiseList()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            //setLoading(false)

        }

    }

    const addvaendor = () => {
        router.push('/franchise/addFranchise')
    }

   



    const searchfranchise = (value: any) => {
        let Results = data?.data?.data?.filter((com: any) => com?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.franchise_id.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setFranchiseList(Results)
        })
    }


    // useEffect(() => {
    //     //getFranchiseList()
    // }, [])


    if(isLoading){
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchfranchise} addbtn={true} imprtBtn={false} Headerlabel='Franchisee' onClick={addvaendor} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    }


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
