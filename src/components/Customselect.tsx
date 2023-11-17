import { Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Controller } from "react-hook-form";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    placeholder: string,
    error: any,
    type: any,
    onChangeValue: any,
    height: number,
    background: string,
    children?: string | JSX.Element | JSX.Element[],
    selectvalue: string,
    options: any,
    value: any,
    size: number,
    label: string,
    disabled?: boolean
}




const Customselect = ({
    fieldName,
    control,
    fieldLabel,
    error,
    children,
    onChangeValue,
    background,
    height,
    size,
    value,
    label,
    disabled

}: props) => {

    const [open, setOpen] = useState<boolean>(false)

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {

        setOpen(true);


    };


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
                    <Select
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        displayEmpty
                        onChange={onChangeValue}
                        disabled={disabled}
                        onBlur={onBlur}
                        value={value}
                        label={label}
                        defaultValue={value}
                        IconComponent={() => (
                            <>
                                {!disabled &&
                                    <Box
                                        borderRadius={5}
                                        mx={1}
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleOpen}
                                        display="flex"
                                        justifyContent={"center"}
                                        alignItems="center"
                                        bgcolor="#58d36e"
                                        color={"#fff"}

                                    >
                                        <KeyboardArrowDownIcon style={{ fontSize: 20, fontWeight: 'bold' }} />
                                    </Box>}
                            </>
                        )}
                        style={{
                            background: background,
                            height: height,
                            width: '100%'
                        }}

                    >
                        {children}
                    </Select>
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
    )
}

export default Customselect