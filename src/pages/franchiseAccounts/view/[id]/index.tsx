import { fetchData } from '@/CustomAxios'
import FranchiseeAccountsform from '@/Widgets/FranchiseeAccount/FranchiseeAccountsForm'
import CustomHeaderBack from '@/Widgets/CustomHeaderBack'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const FranchiseeView = () => {
    const router = useRouter()
    const { id } = router.query
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <Box px={5} py={2} pt={10} mt={0}>
            <CustomHeaderBack backlabel='View Franchisee' />
            <FranchiseeAccountsform view={id}/>
        </Box>
    )
}

export default FranchiseeView
