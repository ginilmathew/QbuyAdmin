import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import Link from 'next/link';

const RiderRefferal = () => {
    const router = useRouter()

    const columns: GridColDef[] = [
        { field: 'Rider ID', headerName: 'Rider ID', flex: 1, },
        {
            field: 'Rider Name',
            headerName: 'Rider Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Contact ',
            headerName: 'Contact',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Phone Number',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Referred By',
            headerName: 'Referred By',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Referred Date & Time',
            headerName: 'Referred Date & Time',
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
                    <Link href={{
                        pathname:'/riderRefferal/[userId]'
                      }}>
                        <RemoveRedEyeIcon

                            style={{
                                color: '#58D36E',
                                cursor: 'pointer'
                            }} />
                    </Link>

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
                <CustomTableHeader imprtBtn={false} Headerlabel='Delivery Boy Refferal' onClick={null} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default RiderRefferal
