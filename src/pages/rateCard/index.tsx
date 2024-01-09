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
const RateCard = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/rate-card/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false)
    const [item, setItem] = useState([]);
    const [_id, set_id] = useState<string>('');

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

    const addRateCard = () => {
        router.push('/rateCard/addRateCard')
    }

    const viewPage = (id: any) => {
        router.push(`/rateCard/view/${id}`)
    }

    const editPage = (id: any) => {
        router.push(`/rateCard/edit/${id}`)
    }




    const columns: GridColDef[] = [
        {
            field: 'Date Added',
            headerName: 'Date Added',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'rate_card_type',
            headerName: 'Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'reason',
            headerName: 'Reason',
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
            valueGetter: (params) => params.row.locality?.franchise_name,

        },
        {
            field: 'driver_rate',
            headerName: 'Driver Rate',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'customer_rate',
            headerName: 'Customer Rate',
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
        let competitiions = data?.data?.data?.filter((com: any) => com?.rate_card_type.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.locality?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.driver_rate.toString().toLowerCase().includes(value.toLowerCase()) || com?.customer_rate.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Rate Card' onClick={addRateCard} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete _id='' data={''} setData={''} url='' onClose={() => handleClose()} open={open} />}
            {open && <CustomDelete
                heading='Rate'
                paragraph='rate'
                _id={_id}
                setData={setItem}
                data={item}
                url={`admin/rate-card/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default RateCard
