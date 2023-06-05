import CustomTable from '@/components/CustomTable'
import UserContext from '@/helpers/user';
import ProtectedRoute from '@/Routes/protectedRoutes';
import CustomerCard from '@/Widgets/CustomerCard'
import Profitchart from '@/Widgets/Profitchart'
import { Grid, LinearProgress, Stack } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react'
import { useSession } from "next-auth/react"


const Dashboard = () => {
    const userContext = useContext(UserContext);
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    const { data: session, status } = useSession()



    useEffect(() => {
        if(session){
            let details = JSON.parse(JSON.stringify(session.user))
            localStorage.setItem("token", details?.accessToken)
        }
    }, [session])
    

   
    



    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 1, },
        {
            field: 'firstName',
            headerName: 'First name',
            flex: 1,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            flex: 1,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            flex: 1,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
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

    // if(loading){
    //     <Stack sx={{ width: '100%', color: 'grey.500' }} >
    //         <LinearProgress color="success" />
    //     </Stack>
    // }

    return (
   
            <Grid container px={5} py={2} spacing={2} bgcolor={'#f5f5f5'} pt={10} mt={0}>
                <Grid item xs={12} md={4} minHeight={1 / 3}>
                    <CustomTable dashboard={true} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label={'Shipments'} />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={false} type={"customer"} count='4500' heading='Total Customers' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={false} type={"customer"} count='4500' heading='Total Customers' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={false} type={"customer"} count='4500' heading='Total Customer Online' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={true} type={"customer"} count='4500' heading='Total Customer Complaints' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={4} minHeight={1 / 3}>
                    <Profitchart heading='Profit(Gross & Net)' />
                </Grid>
                <Grid item xs={12} md={8} minHeight={1 / 3}>
                    <CustomTable dashboard={true} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={false} type={"order"} count='4500' heading='Total Customer Online' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={false} type={"sales"} count='4500' heading='Total Orders' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={3} minHeight={1 / 3}>
                    <CustomerCard numbercount={false} type={"customer"} count='4500' heading='Total Sales' text='loreun ipsum loreum' />
                </Grid>
                <Grid item xs={12} md={3} minHeight={1 / 3}>
                    <CustomTable dashboard={true} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Latest customer Reviews' />
                </Grid>
                <Grid item xs={12} md={2} minHeight={1 / 3}>
                    <CustomerCard numbercount={true} type={"tickets"} count='4500' heading='Rider Tickets' text='loreun ipsum loreum' />
                </Grid>
            </Grid>

    )
}

export default Dashboard