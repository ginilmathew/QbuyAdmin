import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack, Typography } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import CreateExtraCharge from './createExtraCharge';
import { fetchData, postData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';
import { toast } from 'react-toastify';


const fetcher = (url: any) => fetchData(url).then((res) => res);
const ExtraCharges = () => {
    const router = useRouter()
    const { data: extraCharge, error, isLoading } = useSWR(`admin/extra-charge/list`, fetcher);
    const { data, mutate } = useSWR(`admin/extra-charge-value/list`, fetcher);

    console.log({ data })


    useEffect(() => {
        if (extraCharge) {
            setItem2(extraCharge?.data?.data)
        }
    }, [extraCharge])


    useEffect(() => {
        if (data) {
            setItem(data?.data?.data)
        }
    }, [data])


    const [open, setOpen] = useState<boolean>(false);
    const [open1, setOpen1] = useState<boolean>(false);
    const [selectExtra, setSelectExtraCharge] = useState(1)
    const [item2, setItem2] = useState<any>([])
    const [item, setItem] = useState<any>([])
    const [_id, set_id] = useState<string>('');
    const [list, setList] = useState<any>([
        {
            value: 'Extra Charges Value',
            name: 'Extra Charges Value',
            tab: 1
        },
        {
            value: 'Extra Charges',
            name: 'Extra Charges',
            tab: 2
        },
    ])



    const handleClose = () => {
        setOpen(false)
    }


    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const handleClose1 = () => {
        setOpen1(false)
    }

    const handleOpen1 = (id: any) => {
        set_id(id)
        setOpen1(true)
    }
    const addproductItems = () => {
        router.push('/products/addProduct')

    }


    const CreateExtraCharge = () => {
        router.push('/extraCharges/createExtraCharge')

    }

    const addExtraChargeValue = () => {
        router.push('/extraCharges/addExtrachargeValue')
    }

    const viewPage = (row: any) => {

        router.push(
            `/extraCharges/view/${row?._id}`,

        );
        // router.push(`/extraCharges/view/${id}`)
    }

    const editPage = (row: any) => {
        router.push(
            `/extraCharges/edit/${row?._id}`);
    }





    const columns: GridColDef[] = [
        {
            field: 'Dated Added', headerName: 'Dated Added', flex: 1, headerAlign: 'center',
            align: 'center', valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY")
        },
        {
            field: 'Charge Name',
            headerName: 'Charge Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.extra_charge_id?.extra_charge_name

        },
        {
            field: 'Franchise',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.franchise?.franchise_name

        },
        {
            field: 'charge',
            headerName: 'Charge',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'expiry_date_time',
            headerName: 'Expiry date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
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

    const columns2: GridColDef[] = [
        {
            field: 'Dated Added', headerName: 'Dated Added', flex: 1, headerAlign: 'center',
            align: 'center', valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY")
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'label1',
            headerName: 'Label1',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'label2',
            headerName: 'Label2',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },


        {
            field: 'status',
            headerName: 'Status',
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
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen1(row?._id)}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />
                </Stack>
            )
        }
    ];


    const searchItem = useCallback((value: any) => {
        let competitiions = extraCharge?.data?.data?.filter((com: any) => com?.name?.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.charge.toString().toLowerCase().includes(value.toLowerCase()) || com?.label2?.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem2(competitiions)
        })
    }, [item2])
    const searchItem2 = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.charge?.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.franchise?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.extra_charge_id?.extra_charge_name?.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])


    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {

            await postData('admin/extra-charge-value/status', value)
            // setProductList((prev: any) => ([response?.data?.data, ...prev?.filter((res: any) => res?._id !== response?.data?.data?._id)]))
            mutate()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {

        }

    }




    return (
        <Box px={5} pt={10} mt={0}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {list?.map((res: any) => (
                    <Box onClick={() => setSelectExtraCharge(res?.tab)} sx={{ border: '2px solid #58D36E', px: 2, py: 1, mt: 2, background: res?.tab === selectExtra ? "#58D36E" : '', borderRadius: 2, cursor: 'pointer' }}>
                        <Typography>{res?.name}</Typography>
                    </Box>
                ))}

            </Box>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                {selectExtra === 1 &&
                    <CustomTableHeader setState={searchItem2} imprtBtn={false} Headerlabel='Extra Charges Values' onClick={addExtraChargeValue} addbtn={true} />}
                {selectExtra === 2 &&
                    <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Extra Charges' onClick={CreateExtraCharge} addbtn={true} />}
                <Box py={5}>
                    {selectExtra === 1 &&
                        <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />}
                    {selectExtra === 2 && <CustomTable dashboard={false} columns={columns2} rows={item2} id={"_id"} bg={"#ffff"} label='Recent Activity' />}
                </Box>
            </Box>


            {open1 && <CustomDelete
                heading='Extra Charge'
                paragraph='extra charge'
                _id={_id}
                setData={setItem2}
                data={item2}
                url={`admin/extra-charge/delete/${_id}`}
                onClose={handleClose1}
                open={open1} />}
            {open && <CustomDelete
                heading='Extra Charge Value'
                paragraph='extra charge value'
                _id={_id}
                setData={setItem}
                data={item}
                url={`admin/extra-charge-value/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default ExtraCharges
