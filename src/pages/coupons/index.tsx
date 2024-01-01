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
import CustomDelete from '@/Widgets/CustomDelete';
import CustomSwitch from '@/components/CustomSwitch';
import { toast } from 'react-toastify';
const fetcher = (url: any) => fetchData(url).then((res) => res);
const Coupons = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/coupons/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const [item, setItem] = useState([]);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [loading, setLoding] = useState<boolean>(false);

    console.log({ item })

    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
        }
    }, [data?.data?.data])

    console.log({ data })

    const router = useRouter();



    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {
            setLoding(true)
            const response = await postData('admin/coupons/status', value)
            console.log({response})
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
            field: 'coupon_title',
            headerName: 'Coupon Title',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'coupon_code',
            headerName: 'Code',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'discount_type',
            headerName: 'Discount Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'coupon_value',
            headerName: 'Coupon Value',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'minimum_cart_value',
            headerName: 'Cart Value',
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
                        onClick={() => viewcouponPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => EditcouponPage(row?._id)}
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


    const addcoupns = () => {
        router.push('/coupons/addCoupons')

    }
    const viewcouponPage = (id: string) => {
        router.push(`/coupons/view/${id}`)
    }

    const EditcouponPage = (id: string) => {
        router.push(`/coupons/edit/${id}`)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.coupon_title.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.coupon_code.toString().toLowerCase().includes(value.toLowerCase()) || com?.coupon_value.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} addbtn={true} imprtBtn={false} Headerlabel='Coupons' onClick={addcoupns} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
                {open && <CustomDelete
                    heading='Coupon'
                    paragraph='coupn'
                    _id={_id}
                    setData={setItem}
                    data={item}
                    url={`admin/coupons/delete/${_id}`}
                    onClose={handleClose}
                    open={open} />}
            </Box>
        </Box>
    )
}

export default Coupons
