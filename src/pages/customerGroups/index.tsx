import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import moment from 'moment';
import CustomDelete from '@/Widgets/CustomDelete';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

const fetcher = (url: any) => fetchData(url).then((res) => res);
const CustomerGroup = () => {
    const router = useRouter()
    const { data, error, isLoading, mutate } = useSWR(`/admin/customer-group/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);
    const [item, setItem] = useState([]);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoding] = useState<boolean>(false);
    const [_id, set_id] = useState<string>('');

    console.log({item})


    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
        }
    }, [data?.data?.data])

 
    const viewCustomerGroup = (id: any) => {
        router.push(`/customerGroups/view/${id}`)
    }

    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {
            setLoding(true)
            const response = await postData('admin/coupons/status', value)
            console.log({response})
            // setProductList((prev: any) => ([response?.data?.data, ...prev?.filter((res: any) => res?._id !== response?.data?.data?._id)]))
            mutate()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoding(false)

        }

    }


   
    const EditGroupPage = (id: string) => {
        router.push(`/customerGroups/edit/${id}`)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    
    const columns: GridColDef[] = [
        {
            field: 'Cust ID',
            headerName: 'Date',
            flex: 1,
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
   
        {
            field: 'name',
            headerName: 'Customer Name',
            flex: 1,
        },
        {
            field: 'discount_type',
            headerName: 'Discount Type',
            flex: 1,

        },
        {
            field: 'discount_value',
            headerName: 'Discount Value',
            flex: 1,

        },
        
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,

        },
        {
            field: 'Action',
            headerName: 'Action',
            flex:1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <RemoveRedEyeIcon
                       onClick={()=>viewCustomerGroup(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                        <BorderColorTwoToneIcon
                        onClick={() => EditGroupPage(row?._id)}
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
                        }} />


                </Stack>
            )
        }
    ];



    const addCustomerGroupForm = () => {
        router.push('/customerGroups/addCustomerGroups')
    }

    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.discount_value.toString().toLowerCase().includes(value.toLowerCase()) || com?.discount_type.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])

  return (
    <Box px={5} py={2} pt={10} mt={0}>
         <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} addbtn={true} imprtBtn={false} Headerlabel='Customer Group' onClick={addCustomerGroupForm} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                    heading='Customer Groups'
                    paragraph='customer groups'
                    _id={_id}
                    setData={setItem}
                    data={item}
                    url={`admin/customer-group/delete/${_id}`}
                    onClose={handleClose}
                    open={open} />}
    </Box>
  )
}

export default CustomerGroup