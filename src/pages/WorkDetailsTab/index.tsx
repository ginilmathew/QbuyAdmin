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
const CustomTableHeaders = dynamic(() => import('@/Widgets/CustomTableHeaders'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);

type props = {
    res?: any,
    view?: any

}
const WorkDetailsTab = ({ res, view }: props) => {

    console.log({ res })
    const idd = res ? res : view;

    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/work-details/list/${res}`, fetcher);
    const [workdetailsData, setWorkDetailsData] = useState([]);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (data?.data?.data) {
            setWorkDetailsData(data?.data?.data);
            console.log("Workdetails Data:", data?.data?.data);
        }
    }, [data?.data?.data]);

    const columns: GridColDef[] = [
        {
            field: 'date_time',
            headerName: 'Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params?.row?.date_time, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A")
        },
        {
            field: 'login_hrs',
            headerName: 'Login Hrs',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'completed_order',
            headerName: 'Completed Orders',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'cancelled_order',
            headerName: 'Canceled Orders',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'cod',
            headerName: 'Order Total',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'rider_paid',
            headerName: 'Rider Paid',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

    ];
    const searchProducts = useCallback((value: any) => {
        let Results = data?.data?.data?.filter((com: any) =>
            com?.login_hrs.toString().includes(value) ||
            com?.date_time.toString().includes(value)

        );

        startTransition(() => {
            setWorkDetailsData(Results);
        });
    }, [workdetailsData]);



    return (
        <Box px={0} py={1} pt={1} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeaders addbtn={false} setState={searchProducts} imprtBtn={false} Headerlabel='' onClick={() => null} />
                <Box py={1}>
                    <CustomTable dashboard={false} columns={columns} rows={workdetailsData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default WorkDetailsTab