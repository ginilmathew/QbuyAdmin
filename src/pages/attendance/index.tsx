import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTable from '@/components/CustomTable';
import { Stack } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const Attendance = () => {
    const router = useRouter()


    const addvaendor = () => {
        router.push('/category/addCategory')

    }

    const columns: GridColDef[] = [
        { field: 'Date & Time', headerName: 'Date & Time', flex: 1, },
        {
            field: 'Rider Image',
            headerName: 'Rider Image',
            flex: 1,
        },
        {
            field: 'Rider Name',
            headerName: 'Rider Name',
            flex: 1,
        },
        {
            field: 'Franchise',
            headerName: 'Franchise',
            flex: 1,

        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon

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




    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader imprtBtn={false} Headerlabel='Attendance' onClick={() => null} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default Attendance
