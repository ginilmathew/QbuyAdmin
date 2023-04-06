import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';

const SliderManagement = () => {
    const router = useRouter()


    const [open, setOpen] = useState<boolean>(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const addSlider = () => {
        router.push('/')

    }




    const columns: GridColDef[] = [
        { field: 'Date Added', headerName: 'Date Added', flex: 1, },
        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Order',
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

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

  return (
    <Box px={5} py={2} pt={10} mt={0}>

    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader imprtBtn={false} Headerlabel='Slider Management' onClick={addSlider} addbtn={true} />
        <Box py={5}>
            <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
    </Box>
    </Box>
  )
}

export default SliderManagement