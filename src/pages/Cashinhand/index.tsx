import CustomBox from '@/Widgets/CustomBox';
import CustomTableHeader from '@/Widgets/CustomTableHeader';
import CustomInput from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { fetchData, postData } from '@/CustomAxios';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Custombutton from '@/components/Custombutton';
import CashClearInHandModal from '@/Widgets/Shippings/Modal/CashClearInHandModal';
import BootCashModal from '@/Widgets/Shippings/Modal/BootCashModal';
import { set } from 'lodash';
import CustomDatePicker from '@/components/CustomDatePicker';
import moment from 'moment';

type props = {
    res?: any

}
const Cashinhand =({ res }: props)=> {
    

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
        }, [addOpen])
        const openBootModalHere = useCallback(() => {
            setopenBootModal(true)
        }, [openBootModal])
    
        const colseBootModalHere = useCallback(() => {
            setopenBootModal(false)
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
        const Cashinhand = async () => {
            console.log("useeffeft");
            
            try{
                setLoading(true)
                const response = await fetchData(`admin/rider-support/cash-in-hand/list/${res}`);
              
                setCashInHandList(response?.data?.data?.order_list)
                setCashInHandData(response?.data?.data)
              console.log(CashInHandList);
              console.log(response?.data?.data);
              
              setValue('cashinhand',response?.data?.data?.total_cash_in_hand)
              setValue('bootcash',response?.data?.data?.boot_cash_limit)
            }
            catch (err: any) {
                toast.error(err.message || 'Error fetching OTP data');
            } finally {
                setLoading(false);
            }
        }
        useEffect(() => {
            Cashinhand()
        }, [])
        console.log(CashInHandList);
        // const searchProducts = useCallback((value) => {
        //     let competitiions = setSerachList?.filter((com) => com?.name.toString().toLowerCase().includes(value.toLowerCase())
        //     )
        //     startTransition(() => {
        //         setCashInHandList(competitiions)
        //     })
        // }, [CashInHandList])
    
        // const FromDate=(event:any)=>{
        //     const newValue = event.target.value;
         
        // }
        // const ToDate=(event:any)=>{
        //     const newValue = event.target.value;
       
        // }
        // useEffect(() => {
        //     if (fromDate && toDate) {
        //         fetchFilteredData();
        //     }
        // }, [fromDate, toDate]);
        // const fetchFilteredData = async () => {
        //     const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
        //     const formattedToDate = moment(toDate).format('YYYY-MM-DD');
        //     const payload = {
        //         rider_id: res,
        //         from_date: formattedFromDate,
        //         to_date: formattedToDate,
        //     };
        //     try {
        //         const response = await postData('admin/rider-support/cash-in-hand/list-filter', payload);
        //         console.log(response?.data?.data);
                
        //         // setCashInHandList(response.data.data);
        //     } catch (error) {
        //         toast.error('Failed to filter data.');
        //     }
        // };
    
  return (
    <Box>
            <CustomBox title='Cash in Hand Log'>
            
            
             
            <Box bgcolor={"#ffff"} mt={3} p={2} borderRadius={5} height={'85vh'}>
            {/* <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" mt={3}>
                    <div >
                        <CustomDatePicker
                            fieldName='fromDate'
                            control={control}
                            error={''}
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
                            values={toDate}
                            changeValue={(date) => setToDate(date)}
                        />
                    </div>
                </Stack>  */}
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
                <Box py={5}>
                    <CustomTable dashboard={false} columns={columns} rows={CashInHandList ? CashInHandList : {}} id={"_id"} bg={"#ffff"} label='Recent Activity' />
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
            handleClose={colseBootModalHere}
            />
              
                }
        </Box>
        
  )
}

export default Cashinhand