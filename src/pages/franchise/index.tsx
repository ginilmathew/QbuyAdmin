import CustomTable from '@/components/CustomTable'
import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box, Stack } from '@mui/material'
import React from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
const Franchise = () => {
    const router = useRouter();

    const columns: GridColDef[] = [
        { field: ' Franchise ID',
         headerName: 'Franchise ID', 
         flex: 1, 
         headerAlign: 'center',
         align: 'center',
        },
        {
            field: 'Franchise Name',
            headerName: 'Franchise Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
           
        },
        {
            field: 'Owner',
            headerName: 'Owner.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
           
        },
        {
            field: 'Contact No.',
            headerName: 'Contact No.',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: 'Address',
            headerName: 'Address',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: 'Status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: 'Action',
            headerName: 'Action',
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

    const addvaendor = () => {
        router.push('/franchise/addFranchise')
    }

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={true} imprtBtn={false} Headerlabel='Franchise' onClick={addvaendor} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default Franchise
