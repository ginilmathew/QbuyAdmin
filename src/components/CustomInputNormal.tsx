import React from 'react'
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";


type props = {
    fieldName: string,
    fieldLabel: string,
    placeholder: string,
    error: any,
    view: boolean,
    // changeValue:React.ChangeEvent<HTMLInputElement>
    disabled: boolean,
    defaultValue: any
    type: string
    onChangeValue?:any
}



const CustomInputNormal = (
    {
        fieldLabel,
        placeholder,
        error,
        view,
        disabled,
        defaultValue,
        onChangeValue,
        type,
    }: props
) => {
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

                <TextField
                        
                            type={type}
                            defaultValue={defaultValue}
                            onChange={onChangeValue}
                            aria-invalid={error ? "true" : "false"}
                            className="form-control"
                            placeholder={placeholder}
                            id="exampleInputEmail1"
                            InputProps={{
                                disableUnderline: true,
                                readOnly: view ? true : false,
                                style: {
                                    opacity: "1",
                                    background: '#ffff',
                                    height: "40px",
                                    letterSpacing: "1px",
                                    fontWeight: '700px',
                                    border: 'none',
                                    fontFamily: `'Poppins' sans-serif`,
                                },
                            }}
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

export default CustomInputNormal