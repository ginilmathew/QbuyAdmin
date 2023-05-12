import { useRouter } from 'next/router'
import React, { useState, useEffect, useTransition, useCallback } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Avatar, Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import { toast } from "react-toastify";
import moment from 'moment'
import { fetchData, postData } from '@/CustomAxios';
import Image from 'next/image';
import { IMAGE_URL } from '@/Config';
const SliderManagement = () => {
    const router = useRouter()


    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [sliderList, setSliderList] = useState<any>([])
    const [_id, set_id] = useState<string>('');
    const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();

    console.log({ sliderList })

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const addSlider = () => {
        router.push('/sliderManagement/addSlider')

    }
    const editslider = (id: string) => {
        router.push(`/sliderManagement/edit/${id}`)
    }




    const columns: GridColDef[] = [
        {
            field: 'Date Added',
            headerName: 'Date Added',
            flex: 1,
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.franchise?.franchise_name

        },
        {
            field: 'order_number',
            headerName: 'Order',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Image',
            headerName: 'Image',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (<>
                {/* <Image
                    src={`${IMAGE_URL}${row?.image}`}
                    width={100}
                    height={60}
                    alt="Picture of the author"
                /> */}
                <Avatar src={`${IMAGE_URL}${row?.image}`} style={{ height: 60, width: 150, borderRadius: 10 }} variant='square'></Avatar>
            </>)

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

                    <BorderColorTwoToneIcon
                        onClick={() => editslider(row?._id)}
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


    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }
        try {
            setLoading(true)
            await postData('admin/slider/status', value)
            getSlider()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoading(false)

        }

    }

    const searchVendor = useCallback((value: any) => {
        let Result = serachList?.filter((com: any) => com?.franchise?.franchise_name
            .toString().toLowerCase().includes(value.toLowerCase()))
        startTransition(() => {
            setSliderList(Result)
        })
    }, [sliderList])




    const getSlider = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/slider/list/${process.env.NEXT_PUBLIC_TYPE}`);
            setSliderList(response?.data?.data)
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err?.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSlider()
    }, [])



    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchVendor} imprtBtn={false} Headerlabel='Slider Management' onClick={addSlider} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={sliderList} id={"_id"} bg={"#ffff"} rowheight={80} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Slider'
                paragraph='slider'
                _id={_id}
                setData={setSliderList}
                data={sliderList}
                url={`/admin/slider/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default SliderManagement
