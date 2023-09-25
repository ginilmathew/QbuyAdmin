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
        { field: 'Ticket ID', headerName: 'Ticket ID', flex: 1, },
        {
            field: 'item_name',
            headerName: 'Product Item Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Customer Name ',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Phone Number',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Store Name',
            headerName: 'Store Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Assign Rider',
            headerName: 'Assign Rider',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Rider Number',
            headerName: 'Rider Number',
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
            console.log(response);
            
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
    // const rows = [
    //     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    //     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    //     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    //     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    //     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    //     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    //     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    //     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    //     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    // ];

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
