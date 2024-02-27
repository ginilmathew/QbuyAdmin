import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import useSWR from 'swr';
import { fetchData } from '@/CustomAxios';
import moment from 'moment';




const fetcher = (url: any) => fetchData(url).then((res) => res);

const DeliveryCharges = () => {
    const router = useRouter()
    const { data, error, isLoading, mutate } = useSWR(`admin/delivery-charge/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const [open, setOpen] = useState<boolean>(false);
    const [item, setItem] = useState([]);
    const [_id, set_id] = useState<string>('');
    const [loading, setLoding] = useState<boolean>(false);



 

    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
        }
    }, [data?.data?.data])

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }
    const viewPage = (row: any) => {

        router.push(
            `/deliveryCharges/view/${row}`,

        );
        // router.push(`/deliveryCharges/view/${id}`)
    }

    const editPage = (row: any) => {
        router.push(
            `/deliveryCharges/edit/${row}`);
    }


    const addDeliveryCharge = () => {
        router.push('/deliveryCharges/addDeliveryCharges')

    }




    const columns: GridColDef[] = [
        {
            field: 'Dated Added', headerName: 'Dated Added', flex: 1, headerAlign: 'center',
            align: 'center', valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY")
        },
        {
            field: 'charge_name',
            headerName: 'Delivery Charge Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Locality',
            headerName: 'Locality',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.locality?.franchise_name

        },
        {
            field: 'within',
            headerName: 'Within(Kms)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
      

        {
            field: 'normal_charge',
            headerName: 'Normal Charges',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'rate_per_km',
            headerName: 'Rate Per Km',
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
                        onClick={() => viewPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => editPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen(row?._id)}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />
                </Stack>
            )
        }
    ];

    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.locality?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.within.toString().toLowerCase().includes(value.toLowerCase()) || com?.normal_charge.toString().toLowerCase().includes(value.toLowerCase()) || com?.rate_per_km.toString().toLowerCase().includes(value.toLowerCase()) || com?.charge_name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])


    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Delivery Charges' onClick={addDeliveryCharge} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Delivery Charge'
                paragraph='delivery charge'
                _id={_id}
                setData={setItem}
                data={item}
                url={`admin/delivery-charge/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default DeliveryCharges
