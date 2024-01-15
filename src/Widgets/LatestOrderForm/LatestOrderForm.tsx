import { fetchData } from '@/CustomAxios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const LatestOrderForm = () => {

    const router = useRouter()
    const { id } = router.query


  
    useEffect(() => {
        const getList = async () => {
            try {
                const resp = await fetchData(`admin/customer-review/show/${id}`);
               console.log({resp})
                

            } catch (err: any) {

            }finally{
                
            }
        }
        getList()

    }, [])




    return (
        <div>LatestOrderForm</div>
    )
}

export default LatestOrderForm