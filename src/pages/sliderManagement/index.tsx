import { useRouter } from 'next/router'
import React, { useState, useEffect, useTransition, useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Avatar, Box, Stack } from '@mui/material';
import dynamic from 'next/dynamic';
import { toast } from "react-toastify";
import moment from 'moment'
import { fetchData, postData } from '@/CustomAxios';
import Image from 'next/image';
import { IMAGE_URL } from '@/Config';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]';
const CustomDelete = dynamic(() => import('@/Widgets/CustomDelete'), { ssr: false });
const CustomSwitch = dynamic(() => import('@/components/CustomSwitch'), { ssr: false });
const CustomTableHeader = dynamic(() => import('@/Widgets/CustomTableHeader'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const BorderColorTwoToneIcon = dynamic(() => import('@mui/icons-material/BorderColorTwoTone'), { ssr: false })
const DeleteOutlineTwoToneIcon = dynamic(() => import('@mui/icons-material/DeleteOutlineTwoTone'), { ssr: false })
import useSWR from 'swr';

type props = {
    req: any,
    res: any
}

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

//     const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/slider/list/${process.env.NEXT_PUBLIC_TYPE}`, {
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
const fetcher = (url: any) => fetchData(url).then((res) => res);

const SliderManagement = () => {
    const router = useRouter()
    const { data, error, isLoading,mutate } = useSWR(`admin/slider/list/${process.env.NEXT_PUBLIC_TYPE}`,fetcher);

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [sliderList, setSliderList] = useState<any>([])
    const [_id, set_id] = useState<string>('');
    // const [serachList, setSearchList] = useState<any>([])
    const [pending, startTransition] = useTransition();

   useEffect(()=>{
    if(data?.data?.data){
        setSliderList(data?.data?.data)
    }
   },[data?.data?.data])

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = (id: any) => {
        set_id(id)
        setOpen(true)
    }


    const addSlider = () => {
        router.push('/sliderManagement/addSlider')

    }
    const editslider = (id: string) => {
        router.push(`/sliderManagement/edit/${id}`)
    }




    const columns: GridColDef[] = [
        {
            field: 'Date Added',
            headerName: 'Date Added',
            flex: 1,
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY"),
        },
        {
            field: 'Franchisee',
            headerName: 'Franchisee',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.franchise?.franchise_name

        },
        {
            field: 'screentype',
            headerName: 'Screen Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params?.row?.screentype === "null" ||  params?.row?.screentype === "undefined" ? '_' : params?.row?.screentype,

        },
        {
            field: 'order_number',
            headerName: 'Order',
            flex: 1,
            headerAlign: 'center',
            align: 'center',

        },
        {
            field: 'Image',
            headerName: 'Image',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (<>
                {/* <Image
                    src={`${IMAGE_URL}${row?.image}`}
                    width={100}
                    height={60}
                    alt="Picture of the author"
                /> */}
                <Avatar src={`${IMAGE_URL}${row?.image}`} style={{ height: 60, width: 150, borderRadius: 10 }} variant='square'></Avatar>
            </>)

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
                        changeRole={(e: any) => OnchangeCheck(e, row?._id)}
                        checked={row?.status === 'active' ? true : false}

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
                        onClick={() => editslider(row?._id)}
                        style={{
                            color: '#58D36E',
                            cursor: 'pointer'
                        }}
                    />
                    <DeleteOutlineTwoToneIcon
                        onClick={() => handleOpen(row?._id)}
                        sx={{
                            color: '#58D36E',
                            cursor: 'pointer',
                        }} />
                </Stack>
            )
        }
    ];


    const OnchangeCheck = async (e: any, id: string) => {

        let value = {
            id: id,
            status: e.target.checked === true ? "active" : "inactive"
        }
        try {
            setLoading(true)
            await postData('admin/slider/status', value)
            mutate()
        }
        catch (err: any) {
            toast.warning(err?.message)
        } finally {
            setLoading(false)

        }

    }

    const searchVendor = useCallback((value: any) => {
        let Result = data?.data?.data?.filter((com: any) => com?.franchise?.franchise_name
            .toString().toLowerCase().includes(value.toLowerCase()))
        startTransition(() => {
            setSliderList(Result)
        })
    }, [sliderList])




    // const getSlider = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await fetchData(`admin/slider/list/${process.env.NEXT_PUBLIC_TYPE}`);
    //         setSliderList(response?.data?.data)
    //         setSearchList(response?.data?.data)
    //     } catch (err: any) {
    //         toast.error(err?.message)
    //         setLoading(false)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    if(isLoading){
        <Box px={5} py={2} pt={10} mt={0}>
        <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
            <CustomTableHeader setState={searchVendor} imprtBtn={false} Headerlabel='Slider Management' onClick={addSlider} addbtn={true} />
            <Box py={5}>
                <CustomTable dashboard={false} columns={columns} rows={[]} id={"id"} bg={"#ffff"} loading={true} rowheight={80} label='Recent Activity' />
            </Box>
        </Box>
       
    </Box>
    }

    
    if(error){
        toast.error(error?.message)
    }

    // useEffect(() => {
    //     getSlider()
    // }, [])



    return (
        <Box px={5} py={2} pt={10} mt={0}>

            <Box bgcolor={"#ffff"} mt={2} p={2} borderRadius={5} height={'100%'}>
                <CustomTableHeader setState={searchVendor} imprtBtn={false} Headerlabel='Slider Management' onClick={addSlider} addbtn={true} />
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={sliderList ? sliderList : []} id={"_id"} bg={"#ffff"} rowheight={80} label='Recent Activity' />
                </Box>
            </Box>
            {open && <CustomDelete
                heading='Slider'
                paragraph='slider'
                _id={_id}
                setData={setSliderList}
                data={sliderList}
                url={`/admin/slider/delete/${_id}`}
                onClose={handleClose}
                open={open} />}
        </Box>
    )
}

export default SliderManagement
