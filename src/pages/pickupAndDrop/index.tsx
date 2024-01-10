import { useRouter } from 'next/router'
import React, { useState,useEffect} from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';
import moment from 'moment';


const PickupAndDrop = () => {
    const router = useRouter()
    const [Loading, setLoading] =useState<boolean>(false);
    const [ShippingList,setShippingList] = useState<any>([])
    const [serachList, setSearchList] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false)

    console.log({ open })

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

  
    const ShippmentView = (id: string) => {
        router.push(`/pickupAndDrop/edit/${id}`)
    }
const PickdropEdit=(id:string)=>{
    router.push(`/pickupAndDrop/view/${id}`)
}


    const columns: GridColDef[] = [
        { field: 'Ticket ID', headerName: 'Ticket ID', flex: 1, headerAlign: 'center',
        align: 'center', },
        {
            field: 'item_name',
            headerName: 'Created Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),

        },
        {
            field: 'customer',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.customer?.users?.name,

        },
        {
            field: 'pickup_location',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'drop_off_location',
            headerName: 'Store Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'weight',
            headerName: 'Assign Rider',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'vehicle_stype',
            headerName: 'Rider Number',
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
            valueGetter: (params) => params.row.vehicle_type?.name

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
                        onClick={()=>ShippmentView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                    onClick={()=>PickdropEdit(row?._id)}

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    
                </Stack>
            )
        }
    ];

    const ShippingOrders = async () => {

        try {
            setLoading(true)
            const response = await fetchData(`admin/pickup-drop`)
            console.log({RESPONSE:response?.data?.data});
            setShippingList(response?.data?.data)
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        ShippingOrders()
    }, [])
 
    const addPickAndDrop = () => {
        router.push('/pickupAndDrop/addPickAndDrop')
    }
    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader imprtBtn={false} Headerlabel='Pick up & Drop' onClick={ addPickAndDrop} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={ShippingList? ShippingList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default PickupAndDrop
