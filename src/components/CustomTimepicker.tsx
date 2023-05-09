import React, { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';

type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    error: any,
    changeValue: (value: any) => void,
    disabled?: any

}


const CustomTimepicker = ({
    fieldName,
    control,
    fieldLabel,
    error,
    disabled,
    changeValue,
}: props) => {

    return (
        <>
            <FormGroup>
                <Typography letterSpacing={.5} px={'3px'} mb={'3px'}
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
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <MobileTimePicker
                            //disabled={disabled}
                                // sx={{
                                //     "& .MuiInputBase-input": {
                                //         height: "10px" // Set your height here.
                                //     }
                                // }}

                                disablePast
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

export default CustomTimepicker