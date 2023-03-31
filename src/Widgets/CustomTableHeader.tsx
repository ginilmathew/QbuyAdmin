import Custombutton from '@/components/Custombutton';
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import CutomSearch from '../components/CutomSearch'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';


interface props {
    Headerlabel: string,
    onClick: any,
    imprtBtn:boolean
}

const CustomTableHeader = ({ Headerlabel, onClick ,imprtBtn}: props) => {

    type Inputs = {
        search: string,

    };

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>();


    return (
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={60}>
            <Typography fontSize={30} fontWeight={'bold'} color="#58D36E" letterSpacing={1} sx={{fontFamily:`'Poppins' sans-serif`,}}>{Headerlabel}</Typography>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={3}>
                <CutomSearch />
                {imprtBtn &&
                <Custombutton btncolor={'#5889D3'} height={40} endIcon={false} startIcon={true} label={'import Product'} onClick={() => null} IconEnd={KeyboardArrowDownIcon} IconStart={FilterAltIcon} /> }
                <Custombutton btncolor='' height={40} endIcon={true} startIcon={true} label={'Filter'} onClick={() => null} IconEnd={KeyboardArrowDownIcon} IconStart={FilterAltIcon} />
                <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={onClick} IconEnd={''} IconStart={AddIcon} />
            </Box>
        </Box>
    )
}

export default CustomTableHeader