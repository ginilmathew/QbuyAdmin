import React from 'react'
import { Controller } from "react-hook-form";
import { Avatar, Box, FormGroup, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";



type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    placeholder: string,
    error: any,
    view: boolean,
    // changeValue:React.ChangeEvent<HTMLInputElement>
    disabled: boolean,
    defaultValue?: any
    type: string
    onChangeValue?: any
    Values?:any

}


const CustomInput = (
    {
        fieldName,
        control,
        fieldLabel,
        placeholder,
        error,
        view,
        disabled,
        defaultValue,
        onChangeValue,
        type,
        Values
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

                <Controller
                    name={fieldName}
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextField

                            type={type}
                            //defaultValue={defaultValue}
                            value={Values ? Values : value}
                            onChange={
                                onChangeValue ? onChangeValue :
                                    onChange
                            }
                            onBlur={onBlur}
                            aria-invalid={error ? "true" : "false"}
                            className="form-control"
                            placeholder={placeholder}
                            id="exampleInputEmail1"
                            InputProps={{
                                disableUnderline: true,
                                readOnly: view ? true : false,
                                style: {
                                    opacity: "1",
                                    background: view ? "#f2f5f2" :'#ffff',
                                    height: "40px",
                                    letterSpacing: "1px",
                                    fontWeight: '700px',
                                    borderRadius:"4px",
                                    border: 'none',
                                    fontFamily: `'Poppins' sans-serif`,
                                },
                            }}
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

export default CustomInput