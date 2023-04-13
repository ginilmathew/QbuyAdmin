import React from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomTable from '@/components/CustomTable';
import { useRouter } from 'next/router';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import CustomSwitch from '@/components/CustomSwitch';


const Multivendor = () => {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'Vendor ID',
            headerName: 'Vendor ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'Vendor Name',
            headerName: 'Vendor Name',
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
        },

        {
            field: 'Contact No.',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Total Orders',
            headerName: 'Total Orders',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Commission(%)',
            headerName: 'Commission(%)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Total Reviews',
            headerName: 'Total Reviews',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Location',
            headerName: 'Location',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
              <Stack alignItems={'center'} gap={1} direction={'row'}>
                <CustomSwitch
                  changeRole={''}
                  checked={false}
                  defaultChecked={false}
                  onClick={() => null}
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

                    <BorderColorTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon

                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }} />

                </Stack>
            )
        }
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

    const addBanner = () => {
        // router.push('/messageBanner/addBanner')
    }

  return (
    <Box px={5} py={2} pt={10} mt={0}>
    <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
        <CustomTableHeader addbtn={false} imprtBtn={false} Headerlabel='Multivendor' onClick={()=>null} />
        <Box py={5}>
            <CustomTable dashboard={false} columns={columns} rows={rows} id={"id"} bg={"#ffff"} label='Recent Activity' />
        </Box>
    </Box>
</Box>
  )
}

export default Multivendor
