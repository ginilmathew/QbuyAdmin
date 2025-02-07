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


type props = {
    handleClose: any;
    open: boolean;
    franchiseData: { _id: string };
  



}
type Inputs = {
    rider: any;
    priority: any;



};

const AssignModal = ({ handleClose, open,franchiseData }: props) => {




    const [SelectedValue, setSelectedValue] = useState<any>('');
    const [franchiseList, setFranchiseList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [franchase_id, setfranchase_id] = useState<any>('')
  
    const schema = yup.object().shape({
      rider: yup.string().required('Rider field is required').typeError("Rider field is required"),
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
              rider: null,
              priority: null,

            },
        }
       
       ); 
        



  const onselectRider = (event: any) => {
    const newValue = event.target.value;
    if(newValue){
      setError('rider',{message:""})
    }
    console.log(newValue);
    setValue('rider',newValue)
    setSelectedValue(newValue);
  
};





const Submit = async (data: any) => {
  setLoading(true);
 

  try {
  //   let result = franchiseList?.filter((res: any) => res?._id ===SelectedValue).map((get: any) => (
  //     {
  //         name: get?.name,
  //         _id: get?._id,
  //         mobile: get?.mobile,
          
  //     }


  // ))

  let data = {
    order_id: franchiseData?._id,
    rider_id: SelectedValue,
    franchise_id:franchase_id
   
  }
    //   const formData = new FormData();
    //   console.log(franchiseData);
    //   console.log(SelectedValue);
      
   
    //   formData.append('order_id', JSON.stringify(franchiseData?._id));
    
   

    
     
    //   formData.append('rider_id', JSON.stringify(SelectedValue));

  

      const response = await postData('admin/shipment/assign-riders', data);

      if (response.status === 201 || response.status === 200) {
        handleClose(true)
          toast.success("Rider Assigned Successfully");
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



    const riderBasedOnFranchasee = async (franchiseData:any) => {
      try {
        let franchase_id=(franchiseData?.franchisee?._id);
        setfranchase_id(franchase_id)
          setLoading(true)
          const response = await fetchData(`admin/onboarding/riders/${franchase_id}`)
          setFranchiseList(response?.data?.data)

      } catch (err: any) {
          toast.error(err?.message)
          setLoading(false)
      } finally {
          setLoading(false)
      }
  }


    useEffect(() => {
      riderBasedOnFranchasee(franchiseData);
  }, []);


    return (
        <Dialog
            onClose={handleClose}

            open={open}
            maxWidth={'xs'}
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
                        }}>{'Assign Rider'}</Typography>
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
                    <Grid container spacing={2} display={'flex'} flexDirection={'column'} justifyItems={'center'}>
                        <Grid item xs={12} lg={12}>
                            <Customselect
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.rider}
                                fieldName="rider"
                                placeholder={``}
                                fieldLabel={"Choose Rider"}
                                selectvalue={""}
                                height={40}
                                label={''}
                                size={16}
                                value={SelectedValue}
                                options={''}
                                onChangeValue={onselectRider}
                                background={'#fff'}
                            >
                                <MenuItem value="" disabled >
                                    <>Select Rider</>
                                </MenuItem>
                                {franchiseList && franchiseList
        .filter((res:any) => res.online_status === "online")
        .map((res :any) => (
            <MenuItem key={res._id} value={res._id}>{res.name}</MenuItem>
        ))
    }
                            </Customselect>
                        </Grid>
                 
                        {/* <Grid item xs={12} lg={12}>
                            <CustomInput
                                onChangeValue={OnChangePriority}
                                type='text'
                                control={control}
                                error={errors.priority}
                                fieldName="priority"
                                placeholder={``}
                                fieldLabel={"Priority"}
                                disabled={false}
                                view={false}
                              
                                defaultValue={''}
                            />
                        </Grid> */}
                      </Grid>
                    <Box py={1} display={'flex'} justifyContent={'center'}>
                        <Custombutton
                            btncolor=''
                            IconEnd={''}
                            IconStart={''}
                            endIcon={false}
                            startIcon={false}
                            height={''}
                            label={'Add'}
                            disabled={loading}
                            onClick={handleSubmit(Submit)} />
                    </Box>
              
                </DialogContent>
            </Box>

        </Dialog>
    )
}

export default AssignModal