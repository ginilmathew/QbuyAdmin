import { fetchData } from '@/CustomAxios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const ProductReportForm = () => {
    const router = useRouter()
    const {id}=router.query

    useEffect(()=>{
        const reportlist = async()=>{
            try {
               const resp =  await fetchData(`/admin/product-viewed-report-details/${process?.env?.NEXT_PUBLIC_TYPE}/${id}`)
               console.log({resp})

            }catch(err:any){

            }finally{

            }
            
        }

        reportlist()
    },[])
  return (
    <div>ProductReportForm</div>
  )
}

export default ProductReportForm