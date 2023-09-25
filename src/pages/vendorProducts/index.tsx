import { fetchData, postData } from '@/CustomAxios'
import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box, Stack } from '@mui/material'
import { getServerSession } from 'next-auth'
import React, { useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTable from '@/components/CustomTable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import moment from 'moment'
import { authOptions } from '../api/auth/[...nextauth]'
import CustomSwitch from '@/components/CustomSwitch';
import { max, min } from 'lodash';
import { toast } from 'react-toastify';
// type props = {
//     req: any,
//     res: any
// }

// type datapr = {
//     data: any
// }
// // This gets called on every request
// export async function getServerSideProps({ req, res }: props) {
//     // Fetch data from external API
//     //const res = await fetch(`https://.../data`);
//     //const data = await res.json();

//     let session = await getServerSession(req, res, authOptions)

//     let token = session?.user?.accessToken

//     const resu = await fetch(`${process.env.NEXT_BASE_URL}/admin/temp-product/list/${process.env.NEXT_PUBLIC_TYPE}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     const data = await resu?.json();



//     // Pass data to the page via props
//     return { props: { data: data } };
// }


function VendorProducts() {

    const [productList,setProductList]=useState([]);
    const [loading, setLoding] = useState<boolean>(false)

    // console.log({data})

    useEffect(()=>{
        getProductList()
    },[])

    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            product_id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }

        try {
            setLoding(true)
            const response = await postData('admin/product/status-update', value)
            // setProductList((prev: any) => ([response?.data?.data, ...prev?.filter((res: any) => res?._id !== response?.data?.data?._id)]))
            getProductList()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoding(false)

        }

    }

 

    const columns: GridColDef[] = [
    
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
                    return ` ₹${params?.row?.offer_price ? params?.row?.offer_price : 0}`
                } else {
                    if (params?.row?.seller_price > 0) {
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
                    {/* <CustomSwitch
                        changeRole={(e: any) => OnchangeCheck(e, row?._id)}
                        checked={row?.status === 'active' ? true : false}

                    /> */}

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
                        onClick={()=>null}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />
                  
                </Stack>
            )
        }
    ];




    const getProductList = async()=>{
        try{

            const response = await fetchData(`admin/temp-product/list/${process.env.NEXT_PUBLIC_TYPE}`)
            console.log({response:response?.data?.data})
            setProductList(response?.data?.data)

        }catch(err){

        }
    }




    const searchVendor = useCallback((value: any) => {

    }, [])



    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchVendor} addbtn={false} imprtBtn={false} Headerlabel='Vendor Products' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={productList} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default VendorProducts