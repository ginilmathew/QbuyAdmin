
import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useState, useCallback, useTransition } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const CustomSwitch = dynamic(() => import('@/components/CustomSwitch'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
type props = {
    req: any,
    res: any
}

// type datapr = {
//     data: any
// }
// // This gets called on every request
// export async function getServerSideProps({ req, res }: props) {
//     // Fetch data from external API
//     //const res = await fetch(`https://.../data`);
//     //const data = await res.json();

//     let session = await getServerSession(req, res, authOptions)

//     let token = session?.user?.accessToken

//     const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     const data = await resu.json();



//     // Pass data to the page via props
//     return { props: { data: data } };
// }

const fetcher = (url: any) => fetchData(url).then((res) => res);

const VendorSignup = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);


    const router = useRouter();


    const [vendorList, setVendorList] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();


    useEffect(() => {
        if (data?.data?.data) {
            setVendorList(data?.data?.data)
        }
    }, [data?.data?.data])



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
        {
            field: 'account_type',
            headerName: 'Account Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack>
                    <Typography variant="body1"  fontSize={14} letterSpacing={.5} >{row?.account_type}</Typography>
                </Stack>
            )

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
        
        // {
        //     field: 'status',
        //     headerName: 'Status',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center',
        //     renderCell: ({ row }) => (
        //         <Stack>
        //             <Typography variant="body1" sx={{ color:row?.status === 'active' ? '#58D36E' : '#FF0000'}} fontSize={14} letterSpacing={.5} >{row?.status === 'active' ? "ONLINE" : 'OFFLINE'}</Typography>
        //         </Stack>
        //     )
        // },
        {
            field: 'Active Status',
            headerName: 'Active Status',
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


    // const fetchVendorList = useCallback(async () => {
    //     try {
    //         setLoading(true)
    //         const response = await fetchData(`/admin/vendor/list/${process.env.NEXT_PUBLIC_TYPE}`)
    //         setVendorList(response?.data?.data)
    //         setSearchList(response?.data?.data)
    //     }
    //     catch (err: any) {
    //         setLoading(false)
    //         toast.error(err)
    //     }
    //     finally {
    //         setLoading(false)
    //     }

    // }, [vendorList])



    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {
            setLoading(true)
            const response = await postData('admin/vendor/status', value)
            // setProductList((prev: any) => ([response?.data?.data, ...prev?.filter((res: any) => res?._id !== response?.data?.data?._id)]))
            mutate()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoading(false)

        }

    }



    const searchVendor = useCallback((value: any) => {
        let Result = data?.data?.data.filter((com: any) => com?.store_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase) || com?.vendor_mobile?.toString().toLowerCase().includes(value.toLowerCase()))
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

    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchVendor} addbtn={true} imprtBtn={false} Headerlabel='Vendor Signup' onClick={addvaendor} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

        </Box>
    }

    if (error) {
        toast?.error(error?.message)
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