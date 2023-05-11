import { fetchData } from '@/CustomAxios'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import Vendorform from '@/Widgets/vendor/vendorform'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

type serverProps = {
    query: any,
    req: any,
    res: any
}

type props = {
    data: any
}

export async function getServerSideProps({ query, req, res } : serverProps) {
    const id = query.id

    let session = await getServerSession(req, res, authOptions)

    let token = session?.user?.accessToken
    const resu = await fetch(`${process.env.NEXT_BASE_URL}admin/vendor/show/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await resu.json();

    
   
    // Pass data to the page via props
    return { props: { data : data } };

}

const VandorEdit = ({data} : props) => {
    const router = useRouter()
    const { id } = router.query


   
    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='Edit Vendor' />
             <Vendorform res={id} data={data?.data} /> 
        </Box>
    )
}

export default VandorEdit
