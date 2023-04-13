import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';
import CustomDelete from '@/Widgets/CustomDelete';
import { fetchData } from '@/CustomAxios';
import { toast } from 'react-toastify';
const AddProducts = () => {
    const router = useRouter()


    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoding] = useState<boolean>(false)
    const [productList, setProductList] = useState<any>([])
    const [setSerachList, setSearchList] = useState<any>([])
  
 
 console.log({productList})

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const addproductItems = () => {
        router.push('/products/addProduct')

    }




    const columns: GridColDef[] = [
        {
            field: 'product_id', headerName: 'Product ID', flex: 1, headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Product Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'Store Name',
            headerName: 'Store Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.store?.name
        },
        {
            field: 'Price',
            headerName: 'Price',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'minimum_qty',
            headerName: 'Quantity',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'approval_status',
            headerName: 'Approval Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Active Status',
            headerName: 'Active Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    <CustomSwitch
                        changeRole={''}
                        checked={false}
                        defaultChecked={false}
                        onClick={() => null}
                    />

                </Stack>
            )
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
                        onClick={() => handleOpen()}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />
                </Stack>
            )
        }
    ];




    const fetchproduct = async () => {
        try {
            setLoding(true)
            const response = await fetchData('/admin/product/list')
            console.log({ response })
            setProductList(response?.data?.data?.data)
            setSearchList(response.data.data?.data);
        } catch (err: any) {
            setLoding(false)
            toast.error(err?.message)
        }
        finally {
            setLoding(false)
        }
    }


    const searchProducts = useCallback((value:any) => {
        let competitiions = setSerachList?.filter((com:any) => com?.name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.product_id.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setProductList(competitiions)
        })
    },[])

    useEffect(() => {
        fetchproduct()
    }, [])



    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={true} Headerlabel='Products' onClick={addproductItems} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={productList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {/* {open && <CustomDelete onClose={() => handleClose()} open={open} />} */}
        </Box>
    )
}

export default AddProducts