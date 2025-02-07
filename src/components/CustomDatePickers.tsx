import React, { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import dayjs from 'dayjs';
type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    error: any,
    changeValue: (value: any) => void,
    values: any,
    disabled?: boolean

}


const CustomDatePickers = ({
    fieldName,
    control,
    fieldLabel,
    error,
    values,
    disabled,
    changeValue,
}: props) => {
    const tomorrow = dayjs().add(1, 'day');

    const datePickerStyle = {
        marginTop: "20px", 
    };
    return (
        <>
            <FormGroup>
                <Typography
                    letterSpacing={0.5}
                    px={"3px"}
                    mb={"1px"}
                    sx={{
                        fontSize: {
                            lg: 16,
                            md: 14,
                            sm: 12,
                            xs: 11,
                        },
                        fontFamily: `'Poppins' sans-serif`,
                    }}
                >
                    {fieldLabel}
                </Typography>
                <Controller
                    name={fieldName}
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Box style={datePickerStyle}> 
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    disabled={disabled}
                                    value={values ? values : value}
                                    onChange={changeValue ? (e: any) => changeValue(e) : onChange}
                                />
                            </Box>
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

export default CustomDatePickers