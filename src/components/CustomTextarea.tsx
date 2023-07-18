import React from 'react'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";


type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    placeholder: string,
    error: any,
    view: boolean,
    // changeValue:React.ChangeEvent<HTMLInputElement>
    disabled: boolean,
    defaultValue: any
    onChangeValue?: any
}

const CustomTextarea = ({
    fieldName,
    control,
    fieldLabel,
    placeholder,
    error,
    view,
    disabled,
    defaultValue,
    onChangeValue,

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
                        <TextareaAutosize
                            readOnly={view}
                            minRows={6}
                            defaultValue={defaultValue}
                            value={value}
                            onChange={(e) => {
                                onChangeValue ? onChangeValue(e) :
                                    onChange(e)
                            }}
                            onBlur={onBlur}
                            aria-invalid={error ? "true" : "false"}
                            className="form-control"
                            placeholder={placeholder}
                            id="exampleInputEmail1"

                        />
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

export default CustomTextarea
