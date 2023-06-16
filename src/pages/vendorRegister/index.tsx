import CustomTableHeader from '@/Widgets/CustomTableHeader'
import CustomTable from '@/components/CustomTable'
import { Box, Stack } from '@mui/material'
import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { fetchData } from '@/CustomAxios';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { useRouter } from 'next/router';
import moment from 'moment';

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

//     const resu = await fetch(`${process.env.NEXT_BASE_URL}/vendor-register-list/${process.env.NEXT_PUBLIC_TYPE}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     const data = await resu.json();



//     // Pass data to the page via props
//     return { props: { data: data } };
// }

const VendorRegister = () => {

    const router = useRouter()

    const [vendorReglist, setVendorRegList] = useState<any>([])
    const [loading, setLoading] = useState<any>(false);
    const [serachList, setSearchList] = useState<any>([])



    const editRegister = useCallback((id: string) => {
        router.push(`/vendor/edit/${id}`)
    }, [])


    const columns: GridColDef[] = [
        {
            field: 'vendor_id',
            headerName: 'Vendor ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'CREATED',
            headerName: 'Vendor Create',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY HH:MM A"),
        },
    
        {
            field: 'vendor_name',
            headerName: 'Vendor Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'vendor_mobile',
            headerName: 'Contact No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'store_name',
            headerName: 'Store Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'vendor_email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },

        {
            field: 'approval_status',
            headerName: 'Approval Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

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
                        onClick={() => editRegister(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />

                </Stack>
            )
        }


    ];


    async function getRegisterList() {
        try {
            setLoading(true)
            const res = await fetchData(`/admin/vendor-register-list/${process.env.NEXT_PUBLIC_TYPE}`);
            setVendorRegList(res?.data?.data);
            setSearchList(res?.data?.data);
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
        } finally {
            setLoading(false)
        }

    }

    const searchVendor = useCallback((value: any) => {
        let Result = serachList?.filter((com: any) => com?.vendor_id.toString().toLowerCase().includes(value.toLowerCase()) || com?.vendor_name.toString().toLowerCase().includes(value.toLowerCase()) || com?.store_name?.toString().toLowerCase().includes(value.toLowerCase()))
        startTransition(() => {
            setVendorRegList(Result)
        })
    }, [vendorReglist])

    useEffect(() => {
        getRegisterList()
    }, [])



    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchVendor} addbtn={false} imprtBtn={false} Headerlabel='Vendor Register' onClick={() => null} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={vendorReglist ? vendorReglist : []} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
            </Box>
        </Box>
    )
}

export default VendorRegister