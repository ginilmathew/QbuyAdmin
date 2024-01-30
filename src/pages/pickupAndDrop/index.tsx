import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback, startTransition } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';
import moment from 'moment';
import useSWR from 'swr';


const fetcher = (url: any) => fetchData(url).then((res) => res);
const PickupAndDrop = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/pickup-drop`, fetcher)
    useEffect(() => {
        if (data?.data?.data) {
            setShippingList(data?.data?.data)
        }
    }, [data?.data?.data])

    const router = useRouter()
    const [ShippingList, setShippingList] = useState<any>([])

    const [open, setOpen] = useState<boolean>(false)



    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }


    const ShippmentView = (id: string) => {
        router.push(`/pickupAndDrop/edit/${id}`)
    }
    const PickdropEdit = (id: string) => {
        router.push(`/pickupAndDrop/view/${id}`)
    }


    const columns: GridColDef[] = [
        {
            field: 'order_id', headerName: 'Ticket ID', flex: 1, headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'item_name',
            headerName: 'Created Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),

        },
        {
            field: 'name',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'mobile',
            headerName: 'Phone Number',
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
            valueGetter: (params) => params.row.email && params.row.email === "undefined" ? '_' : params.row.email,

        },
        {
            field: 'Franchise',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.franchisee?.franchise_name,

        },
        {
            field: 'weight',
            headerName: 'Weight',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'vehicle_type',
            headerName: 'Vehicle Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',


        },

        {
            field: 'status',
            headerName: ' Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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
                        onClick={() => ShippmentView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    {/* <BorderColorTwoToneIcon
                    onClick={()=>PickdropEdit(row?._id)}

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    /> */}

                </Stack>
            )
        }
    ];


    const addPickAndDrop = () => {
        router.push('/pickupAndDrop/addPickAndDrop')
    }
    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.order_id.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.name.toString().toLowerCase().includes(value.toLowerCase()) || com?.mobile.toString().toLowerCase().includes(value.toLowerCase()) || com?.email.toString().toLowerCase().includes(value.toLowerCase()) || com?.franchisee?.franchise_name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setShippingList(competitiions)
        })
    }, [ShippingList])

    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Pick up & Drop' onClick={addPickAndDrop} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={ShippingList ? ShippingList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default PickupAndDrop
