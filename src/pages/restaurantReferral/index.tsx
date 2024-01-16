import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import useSWR from 'swr';

const fetcher = (url: any) => fetchData(url).then((res) => res);
const RestaurantReferral = () => {
    const router = useRouter()
    const { data, error, isLoading, mutate } = useSWR(`/admin/referral-restaurant/list`, fetcher);

    const [item, setItem] = useState([]);



    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
        }
    }, [data?.data?.data]);

    const viewPage = (id: any) => {
        router.push(`/restaurantReferral/view/${id}`)
    }
    const columns: GridColDef[] = [
        {
            field: 'Customer ID',
            headerName: 'Customer ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.user_id,
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'restaurant_name',
            headerName: 'Referred Restaurant',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'city',
            headerName: 'City',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'location',
            headerName: 'Location',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Store Phone Number',
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
                    <RemoveRedEyeIcon
                       onClick={()=>viewPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
    ];


    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.user?.user_id.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.name?.toString().toLowerCase().includes(value.toLowerCase()) || com?.restaurant_name?.toString().toLowerCase().includes(value.toLowerCase()) || com?.city?.toString().toLowerCase().includes(value.toLowerCase()) || com?.location?.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition (() => {
            setItem(competitiions)
        })
    }, [item])

  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader setState={searchItem} addbtn={false} imprtBtn={false} Headerlabel='Restaurant Referral' onClick={() => null} />
        <Box py={5}>
            <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
    </Box>
</Box>

  )
}

export default RestaurantReferral