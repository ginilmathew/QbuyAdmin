import React, { useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import useSWR from 'swr';
import { fetchData } from '@/CustomAxios';
import FranchiseEnquiryModal from './FranchiseEnquireModal'

const fetcher = (url: any) => fetchData(url).then((res) => res);
const FranchiseEnquires = () => {
    const [open, setOpen] = useState(false)
    const[item,setItem]=useState(null)

    const router = useRouter();


    const { data, error, isLoading, mutate } = useSWR('/admin/franchise-enquiry/list', fetcher)
     






    const NavigateToFarchiseView = (id: any) => {
        router.push(`/franchise/view/${id}`)
    }

    const OpenModal = (row:any) => {
        setItem(row)
        setOpen(true)
    }


    const CloseModal =()=>{
        setOpen(false)
    }
    const columns: GridColDef[] = [
        {
            field: 'franchise_enquiry_id',
            headerName: 'Franchise Enquiry ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'mobile',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'location',
            headerName: 'Location',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'status',
            headerName: 'Status',
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
                    {/* <RemoveRedEyeIcon
                        onClick={() => NavigateToFarchiseView(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} /> */}
                    <BorderColorTwoToneIcon
                        onClick={()=>OpenModal(row)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    {/* <DeleteOutlineTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} /> */}
                </Stack>
            )
        }
    ];

  
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Franchise Enquires' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={data?.data?.data || []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <FranchiseEnquiryModal open={open} close={CloseModal} res={item} mutate={mutate}/>}
        </Box>
    )
}

export default FranchiseEnquires