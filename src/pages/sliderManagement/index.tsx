import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import { toast } from "react-toastify";
import moment from 'moment'
import { fetchData } from '@/CustomAxios';
const SliderManagement = () => {
    const router = useRouter()


    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [sliderList, setSliderList] = useState<any>([])


    console.log({ sliderList })

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const addSlider = () => {
        router.push('/sliderManagement/addSlider')

    }




    const columns: GridColDef[] = [
        { field: 'Date Added',
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
                        changeRole={''}
                        checked={false}
                        defaultChecked={false}
                        onClick={() => null}
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

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen()}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />
                </Stack>
            )
        }
    ];




    const getSlider = async () => {
        try {
            setLoading(true)
            const response = await fetchData('admin/slider/list');
            setSliderList(response?.data?.data)
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
                <CustomTableHeader imprtBtn={false} Headerlabel='Slider Management' onClick={addSlider} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={sliderList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default SliderManagement
