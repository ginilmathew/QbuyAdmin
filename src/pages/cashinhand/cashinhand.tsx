import CustomTableHeader from '@/Widgets/CustomTableHeader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { fetchData, postData } from '@/CustomAxios';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { set } from 'lodash';
const CustomBox = dynamic(() => import( '@/Widgets/CustomBox'), { ssr: false });
const CustomInput = dynamic(() => import('@/components/CustomInput'), { ssr: false });
const CustomTable = dynamic(() => import('@/components/CustomTable'), { ssr: false });
const BootCashModal = dynamic(() => import('@/Widgets/Shippings/Modal/BootCashModal'), { ssr: false });
const CashClearInHandModal = dynamic(() => import('@/Widgets/Shippings/Modal/CashClearInHandModal'), { ssr: false });
const CustomDatePicker = dynamic(() => import('@/components/CustomDatePicker'), { ssr: false });
const Custombutton = dynamic(() => import('@/components/Custombutton'), { ssr: false })
import moment from 'moment';
import useSWR from 'swr';

type props = {
    res?: any,
    view?: any


}
const fetcher = (url: any) => fetchData(url).then((res) => res);
const Cashinhand =({ res, view }: props)=> {
    
    const { data, error, isLoading, mutate } = useSWR(`admin/rider-support/cash-in-hand/list/${res}`, fetcher);
    const schema = yup.object().shape({
        //   rider: yup.string().required('Rider field is required').typeError("Rider field is required"),
        });
        
    type Inputs = {
        cashinhand: any;
        bootcash: any;
   
      };
      const [CashInHandList, setCashInHandList] = useState<any>([])
      const [CashInHandData, setCashInHandData] = useState<any>()
      const [loading, setLoading] = useState<boolean>(false)
      const [addOpen, setaddOpen] = useState<any>(false)
      const [openBootModal, setopenBootModal] = useState(false)
      const [isDateFilterApplied, setIsDateFilterApplied] = useState(false);


      const [fromDate, setFromDate] = useState<Date | null>(null);
      const [toDate, setToDate] = useState<Date | null>(null);
      const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setError,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
            defaultValues: {
                cashinhand: '',
                bootcash: '',
             

            },


        }
       
       );
        const handleOpenAddModal = useCallback(() => {
            setaddOpen(true)
        }, [addOpen])
    
        const handleCloseAddModal = useCallback(() => {
            setaddOpen(false)
            mutate()
        }, [addOpen])
        const openBootModalHere = useCallback(() => {
            setopenBootModal(true)
        }, [openBootModal])
    
        const colseBootModalHere = useCallback(() => {
            setopenBootModal(false)
            mutate()
        }, [openBootModal])
        console.log(openBootModal);
        
        const columns: GridColDef[] = [

            {
                field: 'delivery_date',
                headerName: 'Date',
                flex: 1,
                headerAlign: 'center',
                align: 'center',
    
            },
    
            {
                field: 'order_id',
                headerName: 'Order ID',
                flex: 1,
                headerAlign: 'center',
                align: 'center',
                
            },
            {
                field: 'grand_total',
                headerName: 'Order Total',
                flex: 1,
                headerAlign: 'center',
                align: 'center',
              
            },
            {
                field: 'payment_type',
                headerName: 'Payment Method',
                flex: 1,
                headerAlign: 'center',
                align: 'center',
                // valueGetter: (params) => params.row.commission ? params.row.commission : '-'
    
            },
            {
                field: 'payment_status',
                headerName: 'Payment Status',
                flex: 1,
                headerAlign: 'center',
                align: 'center',
              
                cellClassName: (params) => {
                    const status = params.value as string;
                    console.log(status);
                    
                    if (status === 'created' ) {
                        return 'active-status';
                    } else if (status === 'paind') {
                        return 'terminated-status';
                    } 
                    return ''; 
                },
            },
       
         
        ];
         const CashinhandFunction = async () => {
            setCashInHandList(data?.data?.data?.order_list)
           setCashInHandData(data?.data)
          setValue('cashinhand',data?.data?.data?.total_cash_in_hand)
          setValue('bootcash',data?.data?.data?.boot_cash_limit)
            
         }
        useEffect(() => {
            if (data?.data?.data?.order_list.length>0) {
              
                CashinhandFunction();
               }
        }, [data?.data?.data])
    
      
        useEffect(() => {
            if (fromDate && toDate) {
                fetchFilteredData();
            }
        }, [fromDate, toDate]);
        const fetchFilteredData = async () => {
            const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(toDate).format('YYYY-MM-DD');
            const payload = {
                rider_id: res,
                from_date: formattedFromDate,
                to_date: formattedToDate,
            };
        
            try {
                const response = await postData('admin/rider-support/cash-in-hand/list-filter', payload);
        
                const filteredData = response?.data?.data || [];
                console.log(filteredData);
        
               
                const isFilterApplied = fromDate !== null && toDate !== null;
                setIsDateFilterApplied(isFilterApplied);
        
                setCashInHandList(filteredData);
            } catch (error) {
                toast.error('Failed to filter data.');
            }
        };
        
        
        useEffect(() => {
            if (!isDateFilterApplied) {
               
                CashinhandFunction();
            }
        }, [isDateFilterApplied]);

        
      if (isLoading) {
        <Box>
            <CustomBox title='Cash in Hand Log'>
            
            
             
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'90vh'}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" mt={3}>
                    <div >
                        <CustomDatePicker
                            fieldName='fromDate'
                            control={control}
                            error={''}
                            past={true}
                            fieldLabel={''}
                            values={fromDate}
                            changeValue={(date) => setFromDate(date)}
                        />
                    </div>
                    <div >
                        <CustomDatePicker
                            fieldName='toDate'
                            control={control}
                            error={''}
                            past={true}
                            fieldLabel={''}
                            values={toDate}
                            changeValue={(date) => setToDate(date)}
                        />
                    </div>
                </Stack> 
                    <Grid container spacing={2}>
               

                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.cashinhand}
                            fieldName={'cashinhand'}
                            placeholder={``}
                            fieldLabel={"Total Cash in Hand"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.bootcash}
                            fieldName="bootcash"
                            placeholder={``}
                            fieldLabel={"Current Bootcash Limit"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                 
                </Grid>
                <Box py={4}>
                    <CustomTable dashboard={false} columns={columns} rows={[]} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
             

            </Box>
           
          </CustomBox>
          <Box  display={'flex'} flexDirection={'row'} gap={3}>
            <Grid xs={12} md={4}>
                            <Box py={3}>
                            <Custombutton
                        //onClick={() => logoutRider(params.row)}
                        disabled={false}
                        btncolor='#F71C1C'
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={"Clear Cash in Hand"}
                        onClick={handleOpenAddModal}
                    />
                    
                            </Box>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Box py={3}>
                            <Custombutton
                        //onClick={() => logoutRider(params.row)}
                        disabled={false}
                        btncolor='#5889D3'
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={"Edit Bootcash Limit"}
                        onClick={ openBootModalHere}
                    />
                    
                            </Box>
                        </Grid>
                        </Box>
          {addOpen &&
            <CashClearInHandModal
                // order_id={id}
                // SetDeliveryCharge={SetDeliveryCharge}
                 rider_id={res}
                cashInHandDetails={CashInHandData}
                open={addOpen}
                handleClose={handleCloseAddModal}
            />}
            {openBootModal&&
            <BootCashModal
            rider_id={res}
            mutate={mutate}
            cashInHandDetails={CashInHandData}
            open={openBootModal}
            handleClose={colseBootModalHere}
            />
              
                }
        </Box>
    }


  if(error){
    toast.error(error?.message)
  }
  return (
    <Box>
            <CustomBox title='Cash in Hand Log'>
            
            
             
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'90vh'}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" mt={3}>
                    <div >
                        <CustomDatePicker
                            fieldName='fromDate'
                            control={control}
                            error={''}
                            past={true}
                            fieldLabel={''}
                            values={fromDate}
                            changeValue={(date) => setFromDate(date)}
                        />
                    </div>
                    <div >
                        <CustomDatePicker
                            fieldName='toDate'
                            control={control}
                            error={''}
                            fieldLabel={''}
                            past={true}
                            values={toDate}
                            changeValue={(date) => setToDate(date)}
                        />
                    </div>
                </Stack> 
                    <Grid container spacing={2}>
               

                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.cashinhand}
                            fieldName={'cashinhand'}
                            placeholder={``}
                            fieldLabel={"Total Cash in Hand"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2.5}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.bootcash}
                            fieldName="bootcash"
                            placeholder={``}
                            fieldLabel={"Current Bootcash Limit"}
                            disabled={false}
                            view={true}
                            defaultValue={''}
                        />
                    </Grid>
                 
                </Grid>
                <Box py={4}>
                    <CustomTable dashboard={false} columns={columns} rows={CashInHandList?CashInHandList:[]} id={"_id"} bg={"#ffff"} label='Recent Activity' />
                </Box>
             

            </Box>
           
          </CustomBox>
          <Box  display={'flex'} flexDirection={'row'} gap={3}>
            <Grid xs={12} md={4}>
                            <Box py={3}>
                            <Custombutton
                        //onClick={() => logoutRider(params.row)}
                        disabled={false}
                        btncolor='#F71C1C'
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={"Clear Cash in Hand"}
                        onClick={handleOpenAddModal}
                    />
                    
                            </Box>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Box py={3}>
                            <Custombutton
                        //onClick={() => logoutRider(params.row)}
                        disabled={false}
                        btncolor='#5889D3'
                        IconEnd={''}
                        IconStart={''}
                        endIcon={false}
                        startIcon={false}
                        height={''}
                        label={"Edit Bootcash Limit"}
                        onClick={ openBootModalHere}
                    />
                    
                            </Box>
                        </Grid>
                        </Box>
          {addOpen &&
            <CashClearInHandModal
                // order_id={id}
                // SetDeliveryCharge={SetDeliveryCharge}
                 rider_id={res}
                cashInHandDetails={CashInHandData}
                open={addOpen}
                handleClose={handleCloseAddModal}
            />}
            {openBootModal&&
            <BootCashModal
            rider_id={res}
            cashInHandDetails={CashInHandData}
            open={openBootModal}
            mutate={mutate}
            handleClose={colseBootModalHere}
            />
              
                }
        </Box>
        
  )
}

export default Cashinhand