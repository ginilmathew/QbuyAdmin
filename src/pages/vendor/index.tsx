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

const VendorSignup = () => {

    const router = useRouter();

    const [vendorList, setVendorList] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();


    console.log({ vendorList })

    const columns: GridColDef[] = [
        {
            field: 'vendor_id', headerName: 'Vendor ID', flex: 1,
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
        // {
        //     field: 'Category',
        //     headerName: 'category',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center',
        //     valueGetter: (params: GridValueGetterParams) =>
        //         <>
        //             {/* <Stack>
        //                 {params?.row?.category_id.map((res: any) => {
        //                     <Typography>{res?.name}</Typography>
        //                 }
        //                 )}
        //             </Stack> */}
        //         </>
        // },
        {
            field: 'delivery_location',
            headerName: 'Location',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Approval Status',
            headerName: 'Approval Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params?.row?.firstName || ''} ${params?.row?.lastName || ''}`,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack>
                    <Typography variant="body1" sx={{ color: '#58D36E' }} fontSize={14} letterSpacing={.5} >{row?.status === 'active' ? "ONLINE" : ''}</Typography>
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


    const fetchVendorList = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchData('/admin/vendor/list')
            setVendorList(response?.data?.data?.data)
            setSearchList(response?.data?.data?.data)
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
        console.log({ value })
        let Result = serachList?.filter((com: any) => com?.store_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase()))
        startTransition(() => {
            setVendorList(Result)
        })
    }, [])


    useEffect(() => {
        fetchVendorList()
    }, [])



    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const addvaendor = () => {
        router.push('/vendor/addVendor')

    }


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchVendor} addbtn={true} imprtBtn={false} Headerlabel='Vendor Signup' onClick={addvaendor} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={vendorList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
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