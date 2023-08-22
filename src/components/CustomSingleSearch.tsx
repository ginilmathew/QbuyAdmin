import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Typography } from '@mui/material';
import { Controller } from "react-hook-form";
type props = {
    list: any,
    onChangeValue: any;
    error: any,
    value?: any;
    fieldName: string,
    control: any,
    fieldLabel: string,
}

export default function CustomSingleSearch({ list, onChangeValue, fieldLabel, value, fieldName, control, error }: props) {
    // console.log({ value })
    return (
        <>
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
                render={({ field: { onBlur, onChange } }) => (
                    <Autocomplete
                        value={value}
                        disablePortal
                        id="combo-box-demo"
                        options={list}
                        // sx={{ width: 300 }}
                        onChange={(value, newValue) => {
                            onChangeValue(newValue)
                            // console.log({newValue})
                        }}
                        renderInput={(params) => <TextField {...params} label=""
                            sx={{
                                "& .MuiInputBase-input": {
                                    height: "8px"
                                }


                            }} />}
                    />
                )}
            />
            {error && (
                <p
                    role="alert"
                    style={{
                        color: "red",
                        display: "flex",
                        justifyContent: 'start',
                        paddingLeft: "10px",
                        fontSize: "12px",
                    }}
                >
                    {error?.message}
                </p>
            )}

        </>

    );
}


