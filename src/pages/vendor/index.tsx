import CustomTable from '@/components/CustomTable'
import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useState, useCallback, useTransition } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import CustomDelete from '@/Widgets/CustomDelete';
import { CleanHands } from '@mui/icons-material';
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

type props = {
    req: any,
    res: any
}

type datapr = {
    data: any
}
// This gets called on every request
export async function getServerSideProps({ req, res }: props) {
    // Fetch data from external API
    //const res = await fetch(`https://.../data`);
    //const data = await res.json();

    let session = await getServerSession(req, res, authOptions)

    let token = session?.user?.accessToken

    const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await resu.json();

    
   
    // Pass data to the page via props
    return { props: { data : data } };
}

const VendorSignup = ({data}: datapr) => {



    const router = useRouter();


    const [vendorList, setVendorList] = useState(data?.data);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [serachList, setSearchList] = useState<any>(data?.data)
    const [pending, startTransition] = useTransition();


  


    const addvaendor = () => {
        router.push('/vendor/addVendor')

    }

    const EditVendor = (id: string) => {
        router.push(`/vendor/edit/${id}`)
    }

    const viewVendor = (id: string) => {
        router.push(`/vendor/view/${id}`)
    }



    const columns: GridColDef[] = [
        {
            field: 'vendor_id',
            headerName: 'Vendor ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'vendor_name',
            headerName: 'Vendor Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'vendor_mobile',
            headerName: 'Contact No.',
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
            field: 'display_order',
            headerName: 'Order',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        // {
        //     field: 'delivery_location',
        //     headerName: 'Location',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center',

        // },
        {
            field: 'approval_status',
            headerName: 'Approval Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack>
                    <Typography variant="body1" sx={{ color: row?.approval_status === "Approved" ? '#58D36E' : '#FF0000' }} fontSize={14} letterSpacing={.5} >{row?.approval_status}</Typography>
                </Stack>
            )

        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack>
                    <Typography variant="body1" sx={{ color:row?.status === 'active' ? '#58D36E' : '#FF0000'}} fontSize={14} letterSpacing={.5} >{row?.status === 'active' ? "ONLINE" : 'OFFLINE'}</Typography>
                </Stack>
            )
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                        onClick={() => viewVendor(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => EditVendor(row?._id)}
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


    const fetchVendorList = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchData(`/admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`)
            setVendorList(response?.data?.data)
            setSearchList(response?.data?.data)
        }
        catch (err: any) {
            setLoading(false)
            toast.error(err)
        }
        finally {
            setLoading(false)
        }

    }, [vendorList])





    const searchVendor = useCallback((value: any) => {
        let Result = serachList?.filter((com: any) => com?.store_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase) || com?.vendor_mobile?.toString().toLowerCase().includes(value.toLowerCase()))
        startTransition(() => {
            setVendorList(Result)
        })
    }, [vendorList])


    // useEffect(() => {
    //     fetchVendorList()
    // }, [])



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
                <CustomTableHeader setState={searchVendor} addbtn={true} imprtBtn={false} Headerlabel='Vendor Signup' onClick={addvaendor} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={vendorList ? vendorList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Vendor'
                paragraph='vendor'
                _id={_id}
                setData={setVendorList}
                data={vendorList}
                url={`/admin/vendor/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default VendorSignup