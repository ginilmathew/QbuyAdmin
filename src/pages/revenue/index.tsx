import CustomTableHeader from '@/Widgets/CustomTableHeader'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomTable from '@/components/CustomTable';
import { Stack } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { fetchData } from '@/CustomAxios';
import useSWR from 'swr';
import moment from 'moment';

const fetcher = (url: any) => fetchData(url).then((res) => res);
const Revenue = () => {

	const { data, error, isLoading, mutate } = useSWR(`admin/revenue/list`, fetcher);


	console.log({ data })

	const router = useRouter()


	const columns: GridColDef[] = [
		{ 
			field: 'date', 
			headerName: 'Date', 
			flex: 1, 
			valueGetter: (params: GridValueGetterParams) => moment(params?.row?.date, "YYYY-MM-DD hh:mm A").format("DD-MM-YYYY hh:mm A"),
		},
		{
			field: 'order_id',
			headerName: 'Order ID',
			flex: 1,
		},
		{
			field: 'riderName',
			headerName: 'Rider Name',
			flex: 1,
		},
		{
			field: 'vendor_name',
			headerName: 'Store Name',
			flex: 1,

		},
		{
			field: 'franchise_name',
			headerName: 'Franchise',
			flex: 1,

		},
		{
			field: 'total_order_income',
			headerName: 'Total Order Income',
			flex: 1,

		},
		{
			field: 'vendor_expense',
			headerName: 'Vendor Expense',
			flex: 1,

		},

		{
			field: 'delivery_charge',
			headerName: 'Delivery Expense',
			flex: 1,

		},
		{
			field: 'franchise_profit',
			headerName: 'Profit',
			flex: 1,

		},
		// {
		// 	field: 'Actions',
		// 	headerName: 'Actions',
		// 	width: 200,
		// 	renderCell: ({ row }) => (
		// 		<Stack alignItems={'center'} gap={1} direction={'row'}>
		// 			<RemoveRedEyeIcon

		// 				style={{
		// 					color: '#58D36E',
		// 					cursor: 'pointer'
		// 				}} />

		// 		</Stack>
		// 	)
		// }
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
		<Box px={5} py={2} pt={10} mt={0}>

			<Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
				<CustomTableHeader imprtBtn={false} Headerlabel='Revenue' onClick={() => null} addbtn={false} />
				<Box py={5}>
					<CustomTable dashboard={false} columns={columns} loading={isLoading} rows={data?.data?.data ? data?.data?.data : []} id="id"  bg={"#ffff"} label='Recent Activity' />
				</Box>
			</Box>
		</Box>
	)
}

export default Revenue
