import React, { useState, useTransition, useEffect } from 'react';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import moment from 'moment'


const CustomerActivityReport = () => {


    const [loading, setLoading] = useState<boolean>(false);
    const [reportList, setReportList] = useState<any>([])
    const [pending, startTransition] = useTransition();
    const [serachList, setSearchList] = useState<any>([])


   console.log({reportList})

    const columns: GridColDef[] = [
        {
            field: 'Date',
            headerName: 'Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params.row.created_at).format('DD/MM/YYYY')),
        },
        {
            field: 'Customer ID',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Customer Name',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Last Login Time',
            headerName: 'Last Login Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Last Logout Time',
            headerName: 'Last Logout Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Total Login Hrs',
            headerName: 'Total Login Hrs',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Recently Ordered',
            headerName: 'Recently Ordered',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Recently Viewed store',
            headerName: 'Recently Viewed store',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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

                </Stack>
            )
        }
    ];


    const activityreport = async () => {

        try {
            setLoading(true)
            const response = await fetchData('admin/customer-activity-report')
            console.log({ response })
            console.log({response})
            setReportList(response?.data?.data)
            setSearchList(response?.data?.data)
        } catch (err: any) {
            toast.error(err.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }



    }

    useEffect(() => {
        activityreport()
    }, [])

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
            <Box bgcolor={"#ffff"} mt={1} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Customer Activity Report' onClick={() => null} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={reportList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>

    )
}


export default CustomerActivityReport