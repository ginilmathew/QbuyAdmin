import { fetchData, postData } from '@/CustomAxios'

import { Box, Stack, Typography } from '@mui/material'
import { getServerSession } from 'next-auth'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment'
import { authOptions } from '../api/auth/[...nextauth]'
import CustomSwitch from '@/components/CustomSwitch';
import { max, min } from 'lodash';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import useSWR from 'swr'
import dynamic from 'next/dynamic';

const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CheckCircleIcon = dynamic(() => import('@mui/icons-material/CheckCircle'), { ssr: false });
const HighlightOffIcon = dynamic(() => import('@mui/icons-material/HighlightOff'), { ssr: false });
const Custombutton = dynamic(() => import('@/components/Custombutton'), { ssr: false });
const CustomApproveModal = dynamic(() => import('@/components/CustomApproveModal'), { ssr: false });
const WarningIcon = dynamic(() => import('@mui/icons-material/Warning'), { ssr: false });

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



const fetcher = (url: any) => fetchData(url).then((res) => res);
function VendorProducts() {
    const { data, error, isLoading, mutate } = useSWR(`admin/temp-product/list/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);

    const router = useRouter()

    const [productList, setProductList] = useState([]);
    const [loading, setLoding] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false);
    const [rowid, setId] = useState<any>(null)
    const [setSerachList, setSearchList] = useState<any>([])
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        if (data?.data?.data) {
            setProductList(data?.data?.data)
        }
    }, [data?.data?.data])


    // useEffect(() => {
    //     getProductList()
    // }, [])

   const OnchangeCheck = async (id:any) => {
        if (isApproving) {
            return true; // Don't proceed if an approval is already in progress
            console.log("l");
            
        }

        try {
            console.log("kk");
            
            const response = await fetchData(`/admin/temp-product-approve/${id}`);
            if(response){
                setIsApproving(true); // Set to true to indicate approval is in progress
            }
            let idd = response?.data?.data?._id;
            router.push(`/products/edit/${idd}`);
        } catch (err:any) {
            toast.warning(err?.message);
        } finally {
             // Reset the state variable
        }
    }


    const RejectConformation = useCallback((id: string) => {
        setModal(true)
        setId(id)

    }, [])


    const HandleClose = useCallback(() => {
        setModal(false)
    }, [modal])



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
            headerName: 'Approve / Reject',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    {(row?.approval_status === "rejected" || row?.approval_status === "approved" || loading===true) ? (          
                        <>
                            <Box
                                style={{
                                    color: 'grey',
                                }}
                            >
                                <CheckCircleIcon />
                            </Box>
                            <Box
                                style={{
                                    color: 'grey',
                                }}
                            >
                                <HighlightOffIcon />
                            </Box>
                        </>
                    ) : (
                       
                        <>
                            <Box onClick={() => OnchangeCheck(row?._id)}
                                style={{
                                    color: '#58D36E',
                                    cursor: 'pointer'
                                }}
                            >
                                <CheckCircleIcon />
                            </Box>
                            <Box
                                onClick={() => RejectConformation(row?._id)}
                                style={{
                                    color: 'red',
                                    cursor: 'pointer'
                                }}
                            >
                                <HighlightOffIcon />
                            </Box>
                        </>
                    )}
                </Stack>

            )
        },

    ];




    // const getProductList = async () => {
    //     try {

    //         const response = await fetchData(`admin/temp-product/list/${process.env.NEXT_PUBLIC_TYPE}`)
    //         setSearchList(response.data.data);
    //         setProductList(response?.data?.data)

    //     } catch (err) {

    //     }
    // }


    const Confirmreject = useCallback(async () => {

        try {
            await fetchData(`admin/temp-product-reject/${rowid}`)
            HandleClose()
            mutate()

        } catch (err: any) {

        }

    }, [modal])



    const searchProducts = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.name.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.store?.name?.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setProductList(competitiions)
        })
    }, [productList])



    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Vendor Products' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>

        </Box>
    }


    if (error) {
        toast.error(error?.message)
    }
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchProducts} addbtn={false} imprtBtn={false} Headerlabel='Vendor Products' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={productList ? productList : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            {modal &&
                <CustomApproveModal open={modal} onClose={HandleClose}>
                    <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'} width={{ lg: 300, md: 300, xs: 250 }} py={3} flexDirection={'column'}>
                        <Box>
                            <WarningIcon style={{ color: 'orange', fontSize: 30 }} />
                        </Box>
                        <Box>
                            <Typography sx={{
                                fontSize: {
                                    lg: 16,
                                    md: 14,
                                    sm: 12,
                                    xs: 11,
                                },
                                fontFamily: `'Poppins' sans-serif`,

                            }}>Are you sure ?</Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-around'} gap={2} alignItems={'center'} py={2}>
                            <Custombutton
                                disabled={loading}
                                btncolor='red'
                                IconEnd={''}
                                IconStart={''}
                                endIcon={false}
                                startIcon={false}
                                height={''}
                                label={'No'}
                                onClick={HandleClose} />
                            <Custombutton
                                disabled={loading}
                                btncolor=''
                                IconEnd={''}
                                IconStart={''}
                                endIcon={false}
                                startIcon={false}
                                height={''}
                                label={'yes'}
                                onClick={() => Confirmreject()} />

                        </Box>

                    </Box>
                </CustomApproveModal>}
        </Box>
    )
}

export default VendorProducts