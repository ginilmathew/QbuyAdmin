import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { Box, Stack, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import useSWR from 'swr'
import { fetchData } from '@/CustomAxios'
import CustomDelete from '@/Widgets/CustomDelete'
import CutomSearch from '@/components/CutomSearch'
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const fetcher = (url: any) => fetchData(url).then((res) => res);

type props = {
    id: any
}

const RiderTicketTable = ({ id }: props) => {

    const [tab, setTab] = useState<any>('all')


    const { data, error, isLoading, mutate } = useSWR(`admin/ticket/list/driver/${id}`, fetcher);


    const router = useRouter()

    const [item, setItem] = useState([]);
    const [open, setOpen] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');
    const [background, setBackground] = useState('All');
    const [listCount, setListCount] = useState([{
        name: 'All',
        count: null,
    },
    {
        name: 'Processing',
        count: 0
    },
    {
        name: 'Picked',
        count: 0
    },
    {
        name: 'Closed', count: 0
    }])

    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
            listCount[1].count = data?.data?.Processing
            listCount[2].count = data?.data?.Picked
            listCount[3].count = data?.data?.Closed
        }
    }, [data?.data?.data])

    const editPage = (id: string) => {
        router.push(`/riderTickets/edit/${id}`)
    }

    const viewPage = (id: string) => {
        router.push(`/riderTickets/view/${id}`)
    }


    const coloredStatusCell = (params: any) => {
        const statsus = params?.row?.status?.status;

        let color = 'black'; // Default color

        if (statsus === 'Processing') {
            color = '#16af67';
        }
        else if (statsus === 'Picked') {
            color = '#6b5b95';
        } else if (statsus === 'Closed') {
            color = 'red'
        }

        return <div style={{ color, fontWeight: 'bold' }}>{statsus}</div>;
    };


    const columns: GridColDef[] = [
        {
            field: 'ticket_idd', headerName: 'Rider ID', headerAlign: 'center',
            align: 'center', flex: 1, valueGetter: (params) => params.row.rider?.rider_id
        },
        {
            field: 'ticket_id',
            headerName: 'Ticket ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Login Hrs ',
            headerName: 'Rider Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider?.name

        },
        {
            field: 'COD',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider?.primary_franchise?.franchise_name

        },

        {
            field: 'Rider Paid',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider?.mobile

        },
        {
            field: 'Rider Due',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => coloredStatusCell(params)

        },
        {
            field: 'Online Paid',
            headerName: 'Action Taken By',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.action_taken_by?.name

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
                        onClick={() => viewPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    {row?.status?.status !== "Closed" &&
                        <BorderColorTwoToneIcon
                            onClick={() => editPage(row?._id)}
                            style={{
                                color: '#58D36E',
                                cursor: 'pointer'
                            }}
                        />}

                </Stack>
            )
        }


    ];

    class Changetab {
        static changetab(value: any) {
            if (value === 'All') return setTab('all')
            else if (value === 'Processing') return setTab(1)
            else if (value === 'Picked') return setTab(2)
            else return setTab(3)

        }
    }

    const handleButtonClick = (value: any) => {
        setBackground(value)
        Changetab.changetab(value)
    }

    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.rider?.rider_id.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.ticket_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.rider?.name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.rider?.primary_franchise?.franchise_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.rider?.mobile.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <CutomSearch setState={searchItem} />
                    </Box>
                </Box>

                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

        </Box>
    )
}

export default RiderTicketTable