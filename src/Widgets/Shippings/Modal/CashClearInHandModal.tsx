import { Box, DialogContent, Grid, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm, SubmitHandler, set } from "react-hook-form";
import CustomInput from '@/components/CustomInput';
import Custombutton from '@/components/Custombutton';
import CustomAutoCompleteSearch from '@/components/CustomAutoCompleteSearch';
import Customselect from '@/components/Customselect';
import { toast } from 'react-toastify';
import { fetchData, postData } from '@/CustomAxios';
import CustomSingleSearch from '@/components/CustomSingleSearch';
import { getProduct } from '../../../helpers/productHelper/productHelper';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { constants } from 'fs';
import { FormInputs } from '@/utilities/types';


type props = {
    handleClose: any;
    open: boolean;
     cashInHandDetails: { total_cash_in_hand: string };
     rider_id:{rider_id:string}



}
type Inputs = {
    cash_in_hand: any;
    payment_method: any;
    rider_id:any;
    transaction_id:any



};

const CashClearInHandModal = ({ handleClose, open ,cashInHandDetails,rider_id}: props) => {

console.log("cashmodal");



    const [SelectedValue, setSelectedValue] = useState<any>('');
    const [franchiseList, setFranchiseList] = useState<any>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [transaction_id, settransaction_id] = useState<any>('')
  
    const schema = yup.object().shape({
        cash_in_hand: yup.string().required('Total Cash in Hand is required'),
         payment_method: yup.string().required('Payment Method is required'),
        // transaction_id: yup.string().when('payment_method', {
        //     is: "upi",
        //     then: yup.string().required('Transaction ID is required'),
        //     otherwise: yup.string().notRequired()
        // })
    });

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
                cash_in_hand: '',
                payment_method: '',
                rider_id:'',
                transaction_id:''

            },
       });
        

       useEffect(() => {
        setValue('cash_in_hand',cashInHandDetails?.total_cash_in_hand)
    
       }, [cashInHandDetails])
       


  const onselectRider = (event: any) => {
    const newValue = event.target.value;
    if(newValue){
      setError('payment_method',{message:""})
    }
     
    setValue('payment_method',newValue)
    setSelectedValue(newValue);
   
    
};


const [genderOptions, setGenderOptions] = useState<any>([
    {
        value: 'upi',
        name: 'UPI'
    },
    {
        value: 'cash',
        name: 'CASH'
    },
  
]);

 
const OnChangePriority=(event:any)=>{
    const newValue = event.target.value;
    setValue("transaction_id",newValue)
    settransaction_id(newValue)
}
const OnChangePriorityy=(event:any)=>{
    // const newValue = event.target.value;
    // setValue("transaction_id",newValue)
    // settransaction_id(newValue)
}

const Submit = async (data: any) => {
    setLoading(true);
    console.log(data);
  
    try {
    //   let result = franchiseList?.filter((res: any) => res?._id ===SelectedValue).map((get: any) => (
    //     {
    //         name: get?.name,
    //         _id: get?._id,
    //         mobile: get?.mobile,
            
    //     }
  
  
    // ))
 
  
    let data = {
    //   order_id: franchiseData?._id,
      rider_id: rider_id,
     payment_method:SelectedValue,
     cash_in_hand:cashInHandDetails?.total_cash_in_hand,
     transaction_id:transaction_id
     
    }
    
  
        const response = await postData('admin/rider-support/cash-in-hand-settlement/create', data);
  
        if (response.status === 201 || response.status === 200) {
          handleClose(true)
            toast.success("Cash In Hand Successfuly cleared");
            reset();
  
        } else {
  
            toast.error("Failed");
        }
    } catch (error:any) {
      //   console.error(error.message ,"l");
        toast.error(error?.message);
    } finally {
        setLoading(false);
    }
  };
  



//     const riderBasedOnFranchasee = async (franchiseData:any) => {
//       try {
//         let franchase_id=(franchiseData?.franchisee?._id);
//         setfranchase_id(franchase_id)
//           setLoading(true)
//           const response = await fetchData(`admin/onboarding/riders/${franchase_id}`)
//           setFranchiseList(response?.data?.data)

//       } catch (err: any) {
//           toast.error(err?.message)
//           setLoading(false)
//       } finally {
//           setLoading(false)
//       }
//   }


//     useEffect(() => {
//       riderBasedOnFranchasee(franchiseData);
//   }, []);

console.log(SelectedValue);

    return (
        <Dialog
            onClose={handleClose}

            open={open}
            maxWidth={'md'}
            fullWidth
        >
            <Box p={1} >
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box>

                    </Box>
                    <Box>
                        <Typography sx={{
                            fontSize: {
                                lg: 24,
                                md: 20,
                                sm: 16,
                                xs: 11,
                            },
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            fontFamily: `'Poppins' sans-serif`,
                        }}>{'Clear Cash in Hand'}</Typography>
                    </Box>
                    <Box onClick={handleClose}>
                        <Box
                            width={25}
                            height={25}
                            sx={{
                                backgroundColor: 'black',
                                borderRadius: 5,
                                p: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}>
                            <HighlightOffIcon style={{ color: 'white', fontSize: 16 }} /></Box>
                    </Box>
                </Box>
                <DialogContent>
                    <Grid container spacing={2} display={'flex'} flexDirection={'row'} justifyItems={'center'}>
                    <Grid item xs={12} xl={4}>
                            <CustomInput
                                onChangeValue={OnChangePriorityy}
                                type='text'
                                control={control}
                                error={errors.cash_in_hand}
                                fieldName="cash_in_hand"
                                placeholder={``}
                                fieldLabel={"Total Cash in Hand"}
                                disabled={false}
                                view={true}
                              
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} xl={4}>
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.payment_method}
                                fieldName="payment_method"
                                placeholder={``}
                                fieldLabel={"Payment Method "}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={SelectedValue}
                                options={genderOptions}
                                onChangeValue={onselectRider}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Payment Method</>
                                </MenuItem>
                                {genderOptions.map((option: any) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.name}
                                </MenuItem>
                            ))}
                          
                            </Customselect>
                     
                        </Grid>
                 
                     {SelectedValue === "upi" &&   <Grid item xs={12} xl={4}>
                            <CustomInput
                                onChangeValue={OnChangePriority}
                                type='text'
                                control={control}
                                error={errors.transaction_id}
                                fieldName="transaction_id"
                                placeholder={``}
                                fieldLabel={"Transaction ID"}
                                disabled={false}
                                view={false}
                              
                                defaultValue={''}
                            />
                        </Grid>}
                      </Grid>
                    <Box py={1} display={'flex'} justifyContent={'center'}>
                    <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Update'}
                            disabled={loading}
                            onClick={handleSubmit(Submit)} />
                    </Box>
              
                </DialogContent>
            </Box>

        </Dialog>
    )
}

export default CashClearInHandModal