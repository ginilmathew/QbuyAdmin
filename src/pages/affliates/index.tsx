import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTable from '@/components/CustomTable';
import { Button, DialogActions, DialogContent, DialogContentText, Stack, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useSWR from 'swr';
import { fetchData, postData } from '@/CustomAxios';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
const fetcher = (url: any) => fetchData(url).then((res) => res);
const index = () => {
    const router = useRouter()
    const [open, setOpen] = React.useState(false);
    const [datas,setdata]=useState<any>(null)
    console.log({datas})

    const handleClickOpen = () => {

    
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    const { data, error, isLoading, mutate } = useSWR(`/admin/affiliates`, fetcher);
    const [item, setItem] = useState([]);


    useEffect(() => {
        if (data?.data?.data) {
            setItem(data?.data?.data)
        }
    }, [data?.data?.data])


    const runApproveReject = async () => {

      
        try {
            await postData('admin/affiliate/update', datas)
            handleClose()
            mutate()
        } catch (err: any) {

        }
    }


    class ApproveReject {
        static approve(value: any) {
            handleClickOpen()
            return setdata({
                id: value,
                status: "Approved"
            })

        }
        static reject(value: any) {
            handleClickOpen()
            return setdata({
                id: value,
                status: "Rejected"
            })
        }
    }




    const columns: GridColDef[] = [

        {
            field: 'customer_id',
            headerName: 'Customer ID',
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
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'bankname',
            headerName: 'bankname',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },

        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            renderCell: ({ row }) => (
                <>
                    {row?.status === "pending" ? <Stack alignItems={'center'} gap={1} direction={'row'}>
                        <DoneIcon
                            onClick={() => ApproveReject.approve(row?._id)}
                            style={{
                                color: '#58D36E',
                                cursor: 'pointer'
                            }} />
                        <CloseIcon
                            onClick={() => ApproveReject.reject(row?._id)}
                            style={{
                                color: 'red',
                                cursor: 'pointer'
                            }} />

                    </Stack> : <Box>
                        <Typography sx={{ fontFamily: `'Poppins' sans-serif`, fontWeight: 'bold', letterSpacing: 1, color: row?.status === "Approved" ? "#58D36E" : row?.status === "Rejected" ? "red" : '' }}>{row?.status}</Typography></Box>}
                </>

            )
        }
    ];

    const searchItem = useCallback((value: any) => {
        let competitiions = data?.data?.data?.filter((com: any) => com?.customer_id.toString().toLowerCase().includes(value.toLowerCase()) ||
            com?.name.toString().toLowerCase().includes(value.toLowerCase())  || com?.email.toString().toLowerCase().includes(value.toLowerCase())
        )
        startTransition(() => {
            setItem(competitiions)
        })
    }, [item])

    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
                <CustomTableHeader setState={searchItem} imprtBtn={false} Headerlabel='Affliates' onClick={() => null} addbtn={false} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={item} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
            <React.Fragment>
      
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {" Are you sure want to change?"}
          </DialogTitle>
        
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={runApproveReject} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
        </Box>
    )
}

export default index