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
    imprtBtn: boolean,
    addbtn: boolean,
    imprtlabel?: string
    onChange?: any,
    setState?: any

}

const CustomTableHeaders = ({ Headerlabel, onClick, setState, imprtBtn, addbtn, imprtlabel, onChange }: props) => {

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
        <Box display='flex' justifyContent='space-between' alignItems='center' height={60}>
            <CutomSearch setState={setState} />

            <Box display='flex' justifyContent='center' alignItems='center' gap={3}>
            </Box>

            <Box display='flex' justifyContent='flex-end' alignItems='center' gap={3}>
                {imprtBtn && (
                    <Custombutton
                        btncolor={'#5889D3'}
                        height={40}
                        endIcon={false}
                        startIcon={true}
                        label={imprtlabel ? imprtlabel : 'Import Product'}
                        onClick={() => null}
                        IconEnd={KeyboardArrowDownIcon}
                        IconStart={FilterAltIcon}
                    />
                )}
                {addbtn && (
                    <Custombutton
                        btncolor=''
                        height={40}
                        endIcon={false}
                        startIcon={true}
                        label={'Add'}
                        onClick={onClick}
                        IconEnd={''}
                        IconStart={AddIcon}
                    />
                )}
            </Box>
        </Box>
    )
}

export default CustomTableHeaders