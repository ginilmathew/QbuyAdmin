import React, { useState } from 'react'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    error: any,
    changeValue: (value: any) => void,

}


const CustomDatePicker = ({
    fieldName,
    control,
    fieldLabel,
    error,
    changeValue,
}: props) => {
    return (
        <>
            <FormGroup>
                <Typography letterSpacing={1} px={'3px'} mb={'1px'}
                    sx={{
                        fontSize: {
                            lg: 16,
                            md: 14,
                            sm: 12,
                            xs: 11,
                        },
                        fontFamily: `'Poppins' sans-serif`,
                    }}
                >{fieldLabel}
                </Typography>
                <Controller
                    name={fieldName}
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                       
                                <DatePicker 
                                  sx={{
                                    "& .MuiInputBase-input": {
                                        height: "8px" // Set your height here.
                                    }
                                }}

                                value={value}
                                onChange={changeValue ? (e: any) => changeValue(e) : onChange}
                                 />
                        

                        </LocalizationProvider>
                    )}
                />
                {error && (
                    <p
                        role="alert"
                        style={{
                            color: "red",
                            display: "flex",
                            paddingLeft: "10px",
                            fontSize: "12px",
                        }}
                    >
                        {error?.message}
                    </p>
                )}
            </FormGroup>


        </>

    )
}

export default CustomDatePicker