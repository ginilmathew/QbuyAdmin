import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Stack, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { useRouter } from 'next/router';
import { fetchData, postData } from '@/CustomAxios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Custombutton from '@/components/Custombutton';
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const RemoveRedEyeIcon = dynamic(() => import('@mui/icons-material/RemoveRedEye'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false });
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false });
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });

const fetcher = (url: any) => fetchData(url).then((res) => res);

const DeliveryRiders = () => {
    const { data, error, isLoading, mutate } = useSWR(`admin/delivery-riders/list`, fetcher);
    const [deliveryriderData, setDeliveryRiderData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<any>(null)


    useEffect(() => {
        if (data?.data?.data) {
            setDeliveryRiderData(data?.data?.data);
            console.log("RiderData:", data?.data?.data);
        }
    }, [data?.data?.data]);


    const confirmLogout = async() => {
        setOpen(false)
        setLoading(true)
        let datas = {
            attendance_id: selected?._id
        }

        try {
            let res = await postData("admin/delivery-riders/logout", datas)

            if(res?.status === 201){
                mutate()
            }
            

            console.log({res})
        } catch (error: any) {
            //console.log({error})
            toast.error(error?.message)
        }
        finally{
            setLoading(false)
        }
    }


    const logoutRider = async(data: any) => {
        setSelected(data)
        setOpen(true)
        
    }

    const columns: GridColDef[] = [
        {
            field: 'rider_attendance_id',
            headerName: 'Rider ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Rider Name',
            headerName: 'Rider Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider_details?.name,
        },
        {
            field: 'Contact No.',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider_details?.mobile,
        },

        {
            field: 'Franchise',
            headerName: 'Franchise',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider_details?.primary_franchise?.franchise_name,

        },
        {
            field: 'City',
            headerName: 'City',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider_details?.city,

        },
        {
            field: 'Status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.rider_details?.online_status,

        },
        {
            field: 'Action',
            headerName: 'Logout',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <Stack alignItems={'center'} gap={1} direction={'row'}>
                    { row.rider_details?.online_status === "online" && 
                    <Custombutton
                        //onClick={() => logoutRider(params.row)}
                        disabled={false}
                        btncolor='#f96060'
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={"Logout"}
                        onClick={() => logoutRider(row)}
                    />
                    }
                </Stack>
            )
        }
    ];


    // if (isLoading) {
    //     <Box px={5} py={2} pt={10} mt={0}>
    //         <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
    //             <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Riders' onClick={() => null} />
    //             <Box py={5}>
    //                 <CustomTable dashboard={false} columns={columns} rows={[]} loading={true} id={"id"} bg={"#ffff"} label='Recent Activity' />
    //             </Box>
    //         </Box>
    //     </Box>
    // }
    if (error) {
        toast.error(error?.message);
    }
    return (
        <>
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Riders' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={deliveryriderData} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            //onClick={handleClose}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
            fullScreen={false}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Warning?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to logout rider?.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            Disagree
          </Button>
          <Button onClick={confirmLogout} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
        </>
    )
}

export default DeliveryRiders
