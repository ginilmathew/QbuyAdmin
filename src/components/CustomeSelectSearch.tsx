import React from 'react'
import { FormGroup, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
type props = {
    fieldName: string,
    control: any,
    fieldLabel?: string,
    error?: any,
    children?: any,
    max?: any,
    isMultiple?: any,
    selectvalue?: any,
    onChangeValue?: any,
    options?: any,
    background?: any,
    height?: any,
    disabled?: any,
    size?: any,
    value?: any,
    label?: any,
    defaultValue?: any,
    onInputChange?: any,
    inputValue?: any,
    getOptionLabel?: any,
    open?: any,
    renderOption?: any,
    filterOptions?: any,
    placeholder?: any,
    multiple?: boolean,

}
const CustomSelectSearch = ({
    fieldName,
    control,
    fieldLabel,
    error,
    children,
    max,
    isMultiple,
    selectvalue,
    onChangeValue,
    options,
    background,
    height,
    size,
    value,
    disabled,
    label,
    defaultValue,
    onInputChange,
    inputValue,
    getOptionLabel,
    open,
    renderOption,
    filterOptions,
    placeholder
}: props) => {
    return (
        <>
            <FormGroup>
                <Typography sx={{
                    fontSize: {
                        lg: 16,
                        md: 14,
                        sm: 12,
                        xs: 11,
                    },
                    fontFamily: `'Poppins' sans-serif`,

                }}>{fieldLabel}</Typography>
                <Controller
                    name={fieldName}
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Autocomplete
                            multiple={isMultiple ? isMultiple : false}
                            // open={open}
                            filterOptions={filterOptions}
                            renderOption={renderOption}
                            // value={value}

                            onBlur={onBlur}
                            disablePortal
                            id="combo-box-demo"
                            options={options || []}
                            inputValue={inputValue}
                            disabled={disabled}
                            onChange={onChangeValue}
                            onInputChange={onInputChange}
                            getOptionLabel={getOptionLabel}
                            renderInput={(params) => <TextField variant='outlined' {...params} label={placeholder} />}
                            style={{
                                borderRadius: "10px",
                                height: height,

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
                            // flexDirection: "start",
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

export default CustomSelectSearch