import { postData } from '@/CustomAxios';
import CustomTable from '@/components/CustomTable';
import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { DialogProps } from '@mui/material/Dialog';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { GridCloseIcon, GridColDef } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react'

export interface SimpleDialogProps {
    open: boolean;
    id: string;
    date: any;
    onClose: any;
}

const VendorLogsModal = (props: SimpleDialogProps) => {
    const { onClose, open, date, id } = props;


    const [listLog, setListLog] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)



    const columns: GridColDef[] = [
        {
            field: 'order_id',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date',
            headerName: 'Order Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'sales_amount',
            headerName: 'Order Total',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Promotion Amount',
            headerName: 'Order Completed Date & Time',
            width: 300,
            headerAlign: 'center',
            align: 'center',

        },

    ];






    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];


    const orderList = useCallback(async () => {

        let value = {
            "order_date": date,
            "vendor_id": id
        }
        let result: any = []



        try {
            setLoading(true)
            let response = await postData('admin/account/vendors-order-log/list', value);
            let results = response?.data?.data?.map((res: any, i: boolean) => ({
                _id: i,
                ...res
            }))
            setListLog(results)
            setLoading(false)

        } catch (err: any) {
            setLoading(false)
        }

    }, [date, id])





    useEffect(() => {
        if (id && date) {
            orderList()
        }
    }, [id, date])


    const clearData = () => {
        setListLog([])
        onClose()
    }
    
    return (
        <Box>
            <Dialog onClose={clearData} open={open} fullWidth={true}
                maxWidth={'xl'} >
                <Box p={2} >
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>

                        </Box>
                        <Box>
                            <Typography sx={{
                                fontSize: {
                                    lg: 24,
                                    md: 20,
                                    sm: 16,
                                    xs: 11,
                                },
                                fontWeight: 'bold',
                                letterSpacing: 1,
                                fontFamily: `'Poppins' sans-serif`,
                            }}>Order Log</Typography>
                        </Box>
                        <Box onClick={onClose}>
                            <Box
                                width={25}
                                height={25}
                                sx={{
                                    backgroundColor: 'black',
                                    borderRadius: 5,
                                    p: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}>
                                <GridCloseIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                        </Box>
                    </Box>
                    <DialogContent>
                        <Box py={3}>
                            <CustomTable dashboard={false} columns={columns} rows={listLog ? listLog : []} id={"_id"} bg={"#ffff"} label='Recent Activity' checked={false} />
                        </Box>
                    </DialogContent>
                </Box>

            </Dialog>
        </Box>
    )
}

export default VendorLogsModal