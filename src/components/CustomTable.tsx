import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Typography } from '@mui/material';
import Custombutton from './Custombutton';

import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
type props = {
    label: string
    columns: any,
    rows: any,
    id: string,
    bg: string,
    dashboard: boolean,
    rowheight?:number,
    checked?:boolean,
    selectCheck?:any

}
const CustomTable = ({ columns, rows, id, bg, label, dashboard,rowheight,checked }: props) => {
    let texttruncate = label.slice(0, 3);
    let custtext = label.slice(3)

    function selectCheck(itm: GridRowSelectionModel): void {
       
        console.log({itm})
    }

    return (
        <>
            {dashboard &&
                <Box  display={'flex'} justifyContent={'space-between'} alignItems={'center'} bgcolor={'#fff'} px={2} py={1} borderRadius={'5px 5px 0px 0px'}>
                    <Typography> <span style={{ borderBottom: '3px solid #58d36e', paddingBottom: 2 ,fontFamily:`'Poppins' sans-serif`,}}>{texttruncate}</span>{custtext}</Typography>
                    <Custombutton
                        btncolor=''
                        height={""}
                        IconEnd={""}
                        IconStart={''}
                        startIcon={false}
                        endIcon={false}
                        label='View All' onClick={() => null} />
                </Box>}
            <Box height={dashboard ? 215 : '63vh'} boxShadow={dashboard ? 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px' : 0}>
                <DataGrid
                    style={{
                        background: "#ffff",
                        borderRadius: '0px 0px 5px 5px',
                        opacity: 1,
                        fontFamily:`'Poppins' sans-serif`,
                        fontWeight: '200',
                        letterSpacing: '.5px'
                    }}
                    rowHeight={rowheight ? rowheight : 60}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    checkboxSelection={checked ? checked : false}
                    onRowSelectionModelChange={itm => selectCheck(itm)}
                    pageSizeOptions={[10]}
                    getRowId={row => row[id]}
                />
            </Box>

        </>
    )
}

export default CustomTable