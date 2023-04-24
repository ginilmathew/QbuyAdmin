import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchData } from '@/CustomAxios'
import { toast } from 'react-toastify'
import { Box, Typography } from '@mui/material'
import FranchiseForm from '@/Widgets/Franchise/FranchiseForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'

const FranchiseView = () => {
    const router = useRouter()
    const { id } = router.query

    const [loading, setLoading] = useState<boolean>(false)
    const [franchiseList, setFranchiseList] = useState<any>(null)

    const getFranchise = async () => {
        try {
            setLoading(true)
            const response = await fetchData(`admin/franchise/show/${id}`)
            setFranchiseList(response?.data?.data)
        } catch (err: any) {
            toast.success(err.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getFranchise()
    }, [])

    if (loading) {
        return <Box><Typography sx={{ fontSize: 16 }}>Loading...</Typography></Box>
    }

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Franchise' />
            <FranchiseForm view={franchiseList} />

        </Box>
    )
}

export default FranchiseView