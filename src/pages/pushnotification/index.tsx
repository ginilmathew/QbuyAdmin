
import { Box } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);

const pushnotificationList = () => {
    const { data, error, isLoading, mutate } = useSWR(`/admin/push-notification/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const router = useRouter()
    const [notificationData, setNotificationData] = useState([]);
    const [pending, startTransition] = useTransition();
    const [_id, set_id] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);


    useEffect(() => {
        if (data?.data?.data) {
            setNotificationData(data?.data?.data);
            console.log("Notification Data:", data?.data?.data);
        }
    }, [data?.data?.data]);

    const NavigateToaddCustomer = useCallback(() => {
        router.push('/pushnotification/addpush')

    }, []);

    const editNotification = (id: any) => {
        router.push(`/pushnotification/edit/${id}`)
    }
    const viewNotification = (id: any) => {
        router.push(`/pushnotification/view/${id}`)
    }
    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            renderCell: ({row}) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>{row.instant ? "Instant" : "Scheduled"}</label>
                    {!row.instant && <label>{moment(row?.schedule_date_time, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")}</label>}
                </div>
            ),
        },
        {
            field: 'app_target',
            headerName: 'Target App',
            flex: 1,
        },
        {
            field: 'created_at',
            headerName: 'Added Date',
            flex: 1,
            valueGetter: (params) => moment(params?.row?.created_at, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
        },
        {
            field: 'title',
            headerName: 'Notification Title',
            flex: 1,
        },
        
        {
            field: 'app_targets',
            headerName: 'Franchise',
            flex: 1,
            valueGetter: (params) => params.row.franchise?.name,
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
                        onClick={() => viewNotification(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    {row?.instant ? null : ( 
                        <>
                            <BorderColorTwoToneIcon
                                onClick={() => editNotification(row?._id)}
                                style={{
                                    color: '#58D36E',
                                    cursor: 'pointer'
                                }}
                            />
                            <DeleteOutlineTwoToneIcon
                                onClick={() => handleOpen(row?._id)}
                                style={{
                                    color: '#58D36E',
                                    cursor: 'pointer'
                                }}
                            />
                        </>
                    )}
                </Stack>
            ),  
        }
    ];


    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            (com?.title?.toString() || '').toLowerCase().includes(value.toLowerCase()) ||
            (com?.app_target?.toString() || '').toLowerCase().includes(value.toLowerCase()) ||
            (com?.franchise?.name?.toString() || '').toLowerCase().includes(value.toLowerCase())
        );

        startTransition(() => {
            setNotificationData(Results);
        });
    }, [notificationData]);

    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Push Notifications' onClick={NavigateToaddCustomer} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={notificationData} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    }
    if (error) {
        toast.error(error?.message);
    }
    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={false} Headerlabel='Push Notifications' onClick={NavigateToaddCustomer} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={notificationData} id={"_id"} bg={"#ffff"} label='Recent Activity' />

                </Box>
            </Box>
            {open && <CustomDelete
                heading='Push'
                paragraph='Notification'
                _id={_id}
                setData={setNotificationData}
                data={notificationData}
                url={`admin/push-notification/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default pushnotificationList
