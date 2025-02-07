import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import { max, min } from 'lodash'
import moment from 'moment';
import useSWR from 'swr'
import dynamic from 'next/dynamic';
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomSwitch = dynamic(() => import('@/components/CustomSwitch'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });
type props = {
    req: any,
    res: any
}

type datapr = {
    data: any
}

// // This gets called on every request
// export async function getServerSideProps({ req, res }: props) {
//     // Fetch data from external API
//     //const res = await fetch(`https://.../data`);
//     //const data = await res.json();

//     let session = await getServerSession(req, res, authOptions)

//     let token = session?.user?.accessToken

//     const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/product/list/${process.env.NEXT_PUBLIC_TYPE}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     const data = await resu.json();



//     // Pass data to the page via props
//     return { props: { data: data } };
// }

const fetcher = (url: any) => fetchData(url).then((res) => res);
const AddProducts = () => {
    
    const { data, error, isLoading,mutate } = useSWR(`/admin/product/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher)

    const router = useRouter()


    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoding] = useState<boolean>(false);
    const [productList, setProductList] = useState<any>([]);
    // const [setSerachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();
    const [_id, set_id] = useState<string>('');

    useEffect(()=>{
        if(data?.data?.data){
            setProductList(data?.data?.data)
        }
    },[data?.data?.data])
 

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const addproductItems = () => {
        router.push('/products/addProduct')

    }


    const editProductPage = (id: string) => {
        router.push(`/products/edit/${id}`)
    }

    const viewProductPage = (id: string) => {
        router.push(`/products/view/${id}`)
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
            valueGetter: (params) => {
                if (params?.row?.variants?.length > 0) {
                    let price = params?.row?.variants?.map((vari: any) => {
                       
                        
                        return parseFloat(vari.seller_price)
                      
                    })
                    return `₹${min(price)} - ₹${max(price)} `
                }
                else if (moment(params?.row?.offer_date_from) < moment(params?.row?.to)) {
                
                    
                    return ` ₹${params?.row?.offer_price ? params?.row?.offer_price : params?.row?.regular_price? params?.row?.regular_price:'0'}`
                } else {
                    if (params?.row?.seller_price > 0) {
                        console.log(params?.row?.seller_price ? params?.row?.seller_price : 0);
                        
                        return `₹${params?.row?.seller_price ? params?.row?.seller_price : 0}`
                    } else {
                       
                        
                        return `₹${params?.row?.regular_price ? params?.row?.regular_price : 0}`
                    }


                }
            }
        },
        {
            field: 'Commission',
            headerName: 'Commission',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.commission ? params.row.commission : '-'

        },
        {
            field: 'display_order',
            headerName: 'Display order',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.display_order ? params.row.display_order : '-'

        },
        {
            field: 'minimum_qty',
            headerName: 'Minimum Quantity',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.minimum_qty ? params.row.minimum_qty : '-'

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
                        changeRole={(e: any) => OnchangeCheck(e, row?._id)}
                        checked={row?.status === 'active' ? true : false}

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
                        onClick={() => viewProductPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                    <BorderColorTwoToneIcon
                        onClick={() => editProductPage(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen(row?._id)}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />
                </Stack>
            )
        }
    ];

    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            product_id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {
            setLoding(true)
            const response = await postData('admin/product/status-update', value)
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





    const searchProducts = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.product_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.store?.name.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setProductList(competitiions)
        })
    }, [productList])

    if(isLoading){
        <Box px={5} py={2} pt={10} mt={0}>
        <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
            <CustomTableHeader setState={searchProducts} imprtBtn={true} Headerlabel='Products' onClick={addproductItems} addbtn={true} />
            <Box py={3}>
                <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
            </Box>
        </Box>
        
    </Box>

    }

if(error){
    toast.error(error?.message)
}

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchProducts} imprtBtn={true} Headerlabel='Products' onClick={addproductItems} addbtn={true} />
                <Box py={3}>
                    <CustomTable dashboard={false} columns={columns} rows={productList ? productList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Product'
                paragraph='product'
                _id={_id}
                setData={setProductList}
                data={productList}
                url={`admin/product/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}






export default AddProducts