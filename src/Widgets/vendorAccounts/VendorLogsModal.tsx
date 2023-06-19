import CustomTable from '@/components/CustomTable';
import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { DialogProps } from '@mui/material/Dialog';
import { GridCloseIcon, GridColDef } from '@mui/x-data-grid';
import React from 'react'

export interface SimpleDialogProps {
    open: boolean;

    onClose: any;
}

const VendorLogsModal = (props: SimpleDialogProps) => {
    const { onClose, open } = props;



    const columns: GridColDef[] = [
        {
            field: 'Date',
            headerName: 'Order ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Total Sales',
            headerName: 'Order Date & Time',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Sales Amount',
            headerName: 'Order Total',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Promotion Amount',
            headerName: 'Order Completed Date & Time',
            width:300,
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


    return (
        <Box>
            <Dialog onClose={onClose} open={open} fullWidth={true}
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
                            <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' checked={false} />
                        </Box>
                    </DialogContent>
                </Box>

            </Dialog>
        </Box>
    )
}

export default VendorLogsModal