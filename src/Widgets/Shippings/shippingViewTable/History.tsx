import CustomBox from '@/Widgets/CustomBox'
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from '@mui/material';
import moment from 'moment';

type props = {
    res: any
}

const HistoryTable = ({ res }: props) => {

    return (
        <CustomBox title='Order History'>
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Date Added</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="center">Comment</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="center">Status</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {res && res?.map((res: any) => <TableRow
                            key={''}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {moment(res?.created_at).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell align="center">{res?.comments}</TableCell>
                            <TableCell align="center">{res?.status}</TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </CustomBox >
    )
}

export default HistoryTable