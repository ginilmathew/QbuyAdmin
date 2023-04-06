import React from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import { useRouter } from 'next/router';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';


const MessageBanner = () => {
    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'Created Date & Time',
            headerName: 'Created Date & Time',
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
            field: 'Franchise',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'Expiry Time',
            headerName: 'Expiry Time',
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

                    <BorderColorTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
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

    const addBanner = () => {
        router.push('/messageBanner/addBanner')
    }

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={true} imprtBtn={false} Headerlabel='Message Banner' onClick={addBanner} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default MessageBanner
