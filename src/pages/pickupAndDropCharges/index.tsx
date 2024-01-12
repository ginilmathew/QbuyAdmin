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
import { fetchData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';



const fetcher = (url: any) => fetchData(url).then((res) => res);
const PickUpAndDrop = () => {
    const router = useRouter()
    const { data, error, isLoading, mutate } = useSWR(`admin/pick-up-and-drop-charge/list`, fetcher);

    console.log({ data: data?.data?.data })

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





    const columns: GridColDef[] = [
        {
            field: 'Date Created', headerName: 'Date Created', flex: 1, headerAlign: 'center',
            align: 'center', valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.franchise?.franchise_name,

        },
        {
            field: 'Vechicle Type',
            headerName: 'Vechicle Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.vehicle_type?.name,

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
                        onClick={() => viewPage(row)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => editPage(row)}
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


    const addpage = () => {
        router.push('/pickupAndDropCharges/addPickUpAndDrop')
    }


    const viewPage = (row: any) => {

        router.push(
            `/pickupAndDropCharges/view/${row?._id}`,

        );

    }

    const editPage = (row: any) => {
        router.push(
            `/pickupAndDropCharges/edit/${row?._id}`);
    }


    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.franchise?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.vehicle_type?.name.toString().toLowerCase().includes(value.toLowerCase()) || com?.within.toString().toLowerCase().includes(value.toLowerCase()) || com?.rate_per_km.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])





    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Pick up & Drop Charges' onClick={addpage} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='PickUp & Drop'
                paragraph='PickUp & Drop'
                _id={_id}
                setData={setItem}
                data={item}
                url={`admin/pick-up-and-drop-charge/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default PickUpAndDrop
