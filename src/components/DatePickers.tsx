import React, { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
type props = {
    fieldName: string,
    fieldLabel: string,
    error: any,
    changeValue: (value: any) => void,
    values: any,
    defaultvalue?: any

}


const DatePickers = ({
    fieldName,
    fieldLabel,
    error,
    values,
    changeValue,
    defaultvalue
}: props) => {


    const [value, setValue] = useState(null)

    return (
        <>
            <FormGroup>
                <Typography letterSpacing={.5} px={'3px'} mb={'1px'}
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
                <LocalizationProvider dateAdapter={AdapterMoment}>

                    <DatePicker
                        sx={{
                            "& .MuiInputBase-input": {
                                height: "8px" // Set your height here.
                            }
                        }}

                        defaultValue={defaultvalue}
                        value={value ? value : null || values}
                        onChange={(e: any) => {
                            setValue(e)
                            changeValue(e)
                        }}
                    />


                </LocalizationProvider>
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

export default DatePickers