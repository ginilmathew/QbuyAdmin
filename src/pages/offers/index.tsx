import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { fetchData, postData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';
import CustomSwitch from '@/components/CustomSwitch';
import { toast } from 'react-toastify';
import CustomDelete from '@/Widgets/CustomDelete';



const fetcher = (url: any) => fetchData(url).then((res) => res);
const Offers = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/offers/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher)
    const router = useRouter();

    const [item, setItem] = useState([]);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [loading, setLoding] = useState<boolean>(false);

    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
        }
    }, [data?.data?.data])


    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {
            setLoding(true)
            const response = await postData('admin/offers/status', value)
            console.log({ response })
            // setProductList((prev: any) => ([response?.data?.data, ...prev?.filter((res: any) => res?._id !== response?.data?.data?._id)]))
            mutate()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoding(false)

        }

    }

    const columns: GridColDef[] = [
        {
            field: 'Created Date',
            headerName: 'Created Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'offer_title',
            headerName: 'Offer Title',
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
            valueGetter: (params) => params.row.stores?.store_name
        },

        {
            field: 'offer_type',
            headerName: 'Offer Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'offer_value',
            headerName: 'Value',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'limitation',
            headerName: 'Limitation',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'expiry_date',
            headerName: 'Expiry Date',
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
                        onClick={() => viewCustomerGroup(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => EditofferPage(row?._id)}
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

    const addOffers = () => {
        router.push('/offers/addOffers')

    }
    const viewCustomerGroup = (id: any) => {
        router.push(`/offers/view/${id}`)
    }



    const EditofferPage = (id: string) => {
        router.push(`/offers/edit/${id}`)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }
    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.offer_title.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.offer_type.toString().toLowerCase().includes(value.toLowerCase()) || com?.offer_value.toString().toLowerCase().includes(value.toLowerCase())||com?.stores?.store_name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])

    


    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={true} setState={searchItem} imprtBtn={false} Headerlabel='Offers' onClick={addOffers} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Offer'
                paragraph='offer'
                _id={_id}
                setData={setItem}
                data={item}
                url={`admin/offers/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default Offers
