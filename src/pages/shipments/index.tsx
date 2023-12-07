'use client'

import { Router, useRouter } from 'next/router'
import React, { useState, useTransition, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic';
import { GridCloseIcon, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AppBar, Box, Button, Dialog, IconButton, Slide, Stack, Toolbar, Typography } from '@mui/material';

const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
import LoopIcon from '@mui/icons-material/Loop';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { fetchData } from '@/CustomAxios';
import moment from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';
import useSWR from 'swr'
import Custombutton from '@/components/Custombutton';
import AssignModal from '@/Widgets/Shippings/Modal/AssignModal';
import RefundModal from '@/Widgets/Shippings/Modal/RefundModal';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ShippingOrderForm from '@/Widgets/Shippings/ShippingOrderForm';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const fetcher = (url: any) => fetchData(url).then((res) => res);

const Shipments = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [shippingList, setShippingList] = useState<any>([])
    const [pending, startTransition] = useTransition();
    const [serachList, setSearchList] = useState<any>([]);
    const [open, setopen] = useState<any>(false)
    const [editModal, setEditModal] = useState<any>(false)
    const [viewModal, setViewModal] = useState<any>(false)
    const [franchiseData, setfranchiseData] = useState<any>('')
    const [refundModal, setreFundModal] = useState<any>(false)
    const [id, setId] = useState<any>('')

    const { data, error, isLoading, mutate } = useSWR(`admin/orders/${process.env.NEXT_PUBLIC_TYPE}`, fetcher);

    useEffect(() => {
        if (data?.data?.data) {
            setShippingList(data?.data?.data)
            console.log(data);

        }
    }, [data?.data?.data])

    const ShippmentView = (id: string) => {
        setId(id)
        setViewModal(true)
        
        //router.push(`/shipments/view/${id}`)
    }

    const ShippmentEdit = (id: string) => {
        // setId(id)
        // setEditModal(true)
        router.push(`/shipments/edit/${id}`)
    }


    const closeEditModal = () => {
        setEditModal(false);
        setId(null)
        mutate()
    }

    const openAssignModal = useCallback((row: any) => {


        setfranchiseData(row)


        setopen(true)
    },


        [open]
    )
    const handleCloseAddModal = useCallback(() => {
        setopen(false)
        mutate()
    }, [open])

    const openRefundModal = useCallback((row: any) => {
        setfranchiseData(row)
        setreFundModal(true)
    },
        [refundModal]
    )
    const handleCloseRefundModal = useCallback(() => {
        setreFundModal(false)
        mutate()
    }, [refundModal])

    const columns: GridColDef[] = [

        {
            field: 'Actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',

            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} justifyContent={'space-evenly'} direction={'column'} padding={10}>
                    <Stack alignItems={'center'} gap={1} direction={'row'} paddingTop={"20px"}>
                        <RemoveRedEyeIcon
                            onClick={() => ShippmentView(row?._id)}
                            style={{
                                color: '#58D36E',
                                cursor: 'pointer'
                            }}
                        />
                        {(!['completed', 'cancelled'].includes(row?.status)) && (
                            <BorderColorTwoToneIcon
                                onClick={() => ShippmentEdit(row?._id)}
                                style={{
                                    color: '#58D36E',
                                    cursor: 'pointer'
                                }}
                            />
                        )}


                        {(
                            (row?.refundAmount
                            )
                        ) ? (
                            <Custombutton

                                btncolor='#d39a58'
                                height={25}
                                IconEnd={""}
                                IconStart={''}
                                startIcon={false}
                                endIcon={false}
                                onClick={() => openRefundModal(row)}
                                label='Refund'
                            />
                        ) : null}
                        {row?.status !== 'cancelled' && row?.status !== 'completed' && (
                            // Add the condition here to show Assign and Reassign buttons
                            (row?.rider_each_order_settlement === null && (
                                (row?.payment_status === 'created' && row?.payment_type === 'COD') ||
                                (row?.payment_status === 'completed' && row?.payment_type === 'online')
                            )) ? (
                                <Custombutton
                                    disabled={loading}
                                    btncolor='blue'
                                    height={25}
                                    IconEnd={""}
                                    IconStart={''}
                                    startIcon={false}
                                    endIcon={false}
                                    onClick={() => openAssignModal(row)}
                                    label='Assign'
                                />
                            ) : (
                                (row?.rider_each_order_settlement?.rider_status === "active" ||
                                    row?.rider_each_order_settlement?.rider_status === "completed" ||
                                    row?.rider_each_order_settlement?.rider_status === "cancelled" ||
                                    row?.rider_each_order_settlement?.rider_status === "onTheWay") && (
                                    (row?.payment_status === 'created' && row?.payment_type === 'COD') ||
                                    (row?.payment_status === 'completed' && row?.payment_type === 'online')
                                )
                            ) ? (
                                <Custombutton
                                    disabled={true}
                                    btncolor='blue'
                                    height={25}
                                    IconEnd={""}
                                    IconStart={''}
                                    startIcon={false}
                                    endIcon={false}
                                    onClick={null}
                                    label='Assign'
                                />
                            ) : (
                                row?.rider_each_order_settlement?.rider_status === "new" && (
                                    (row?.payment_status === 'created' && row?.payment_type === 'COD') ||
                                    (row?.payment_status === 'completed' && row?.payment_type === 'online')
                                )
                            ) ? (
                                <Custombutton
                                    disabled={loading}
                                    btncolor='#F71C1C'
                                    height={25}
                                    IconEnd={""}
                                    IconStart={''}
                                    startIcon={false}
                                    endIcon={false}
                                    onClick={() => openAssignModal(row)}
                                    label='Reassign'
                                />
                            ) : null
                        )}
                    </Stack>
                </Stack>
            )


        },
        {
            field: 'status',
            headerName: 'Status',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',

            cellClassName: (params) => {
                if (params.row.payment_status === 'completed') {

                    return 'completed-order';
                }
                else if (params.row.payment_status === 'pending') {
                    return 'pending-order'
                }
                else if (params.row.payment_status === 'cancelled') {
                    return 'cancelled-order'
                }
                else if (params.row.payment_status === 'created') {
                    return 'created-order'
                }
                return '';
            }

        },
        {
            field: 'order_id',
            headerName: 'Order ID',
            headerAlign: 'center',
            align: 'center',
            width: matches ? 180 : 200,
        },
        {
            field: 'created_at',
            headerName: 'Date & Time',
            width: matches ? 180 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (moment(params?.row?.created_at).format('DD/MM/YYYY hh:mm A')),

        },
        {
            field: 'customerNameAndAddress',
            headerName: 'Customer Name and Address',
            width: matches ? 300 : 200,
            headerAlign: 'center',
            align: "left",
            valueGetter: (params) => {
                const customerName = params?.row?.customer_address?.name ? params?.row?.customer_address?.name : '-';
                const customerAddress = params?.row?.customer_address?.area?.address ? params?.row?.customer_address?.area?.address : '-';
                const customerphone = params?.row?.customer_address?.mobile ? params?.row?.customer_address?.mobile : '-';
                // return `${customerName}\n${customerAddress} \n ${customerphone}`;
                return (
                    <div>
                        <Tooltip title={customerName + customerAddress + customerphone}>
                            <span>{(customerName + ','   + customerAddress + customerphone).slice(0,26) + '...'  }</span>
                        </Tooltip>
                    </div>
                );
            },
            renderCell: (params) => (
                <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
            ),
        },

        {
            field: 'grand_total',
            headerName: 'Order Total',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.grand_total?.toFixed(2),

        },

        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.franchisee?.franchise_name ? params.row.franchisee?.franchise_name : '-',

        },

        {
            field: 'delivery_type',
            headerName: 'Order Type',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',


        },

        {
            field: 'mobile',
            headerName: 'Mobile',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.user?.mobile ? params.row.user?.mobile : '-',
        },
        {
            field: 'payment_status',
            headerName: 'payment Status',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'payment_type',
            headerName: 'payment Method',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'name',
            headerName: 'Rider',
            width: matches ? 150 : 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider_each_order_settlement?.rider?.name ? params.row.rider_each_order_settlement?.rider?.name : '-'
        },


    ];


    // const searchProducts = useCallback((value: any) => {
    //     let competitiions = data?.data?.data?.filter((com: any) => com?.order_id.toString().toLowerCase().includes(value.toLowerCase())
    //         || com?.user?.mobile.toString().toLowerCase().includes(value.toLowerCase()) ||
    //         com?.franchisee?.franchise_name.toString().toLowerCase().includes(value.toLowerCase())
    //     )
    //     startTransition(() => {
    //         setShippingList(competitiions)
    //     })
    // }, [shippingList])


    const RefreshAgain = () => {
        mutate()
    }

    const searchProducts = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) =>


        (com?.order_id?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
            com?.user?.mobile?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
            com?.user?.name?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
            com?.franchisee?.franchise_name?.toString()?.toLowerCase().includes(value.toLowerCase()))
        );
        startTransition(() => {
            setShippingList(competitiions);
        });
    }, [shippingList]);





    // const ShippingOrders = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await fetchData(`admin/orders/${process.env.NEXT_PUBLIC_TYPE}`)
    //         setShippingList(response?.data?.data)
    //         setSearchList(response?.data?.data)
    //     } catch (err: any) {
    //         toast.error(err.message)
    //         setLoading(false)

    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     ShippingOrders()
    // }, [])

    const addOrderShipmets = () => {
        router.push('/shipments/addOrder')
    }


    if (isLoading) {
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
            <Typography style={{ borderBottom: '3px solid #58d36e', paddingBottom: 2, fontFamily: `'Poppins' sans-serif`, }}>{'Orders'}</Typography>
                <CustomTableHeader imprtlabel={'Export'} setState={searchProducts} imprtBtn={false} Headerlabel='Orders' onClick={addOrderShipmets} addbtn={true} />

                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} id={"id"} bg={"#ffff"} loading={true} label='Recent Activity' />
                </Box>
            </Box>


        </Box>
    }


    if (error) {
        toast.error(error?.message)
    }

    return (

        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
              
                <Box sx={{ display: 'flex', justifyContent:'space-between' }}>
                <Typography style={{ color: '#58d36e', paddingBottom: 2, fontFamily: `'Poppins' sans-serif`, fontSize:30}}>{'Orders'}</Typography>
                
                    <Custombutton
                        btncolor='#cfe19d'
                        IconEnd={''}
                        IconStart={LoopIcon}
                        endIcon={false}
                        startIcon={true}
                        height={''}
                        label={'Refresh'}
                        disabled={false}
                        onClick={RefreshAgain} />
                        <CustomTableHeader imprtlabel={'Export'} setState={searchProducts} imprtBtn={false} Headerlabel='' onClick={addOrderShipmets} addbtn={true} />
                </Box>
                <Box py={1}>
                    <CustomTable  rowheight={60} dashboard={false} columns={columns} rows={shippingList ? shippingList : []} id={"_id"} bg={'#ffff'} label='Recent Activity' />
                </Box>
            </Box>
            {open && <AssignModal
                franchiseData={franchiseData}
                open={open}
                handleClose={handleCloseAddModal}
            />
            }
            {refundModal && <RefundModal open={refundModal} handleClose={handleCloseRefundModal} res={franchiseData} functioncall={handleCloseRefundModal} />}
            <Dialog
                fullScreen
                open={viewModal}
                onClose={()=> setViewModal(false)}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=> setViewModal(false)}
                        aria-label="close"
                        >
                        <GridCloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        View Order
                        </Typography>
                    </Toolbar>
                </AppBar>
                <ShippingOrderForm view={id} />
            </Dialog>
            <Dialog
                fullScreen
                open={editModal}
                onClose={closeEditModal}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={closeEditModal}
                        aria-label="close"
                        >
                        <GridCloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Edit Order
                        </Typography>
                    </Toolbar>
                </AppBar>
                <ShippingOrderForm res={id} onupdate={closeEditModal} />
            </Dialog>
        </Box>

    )
}

export default Shipments



