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
    type: string,
    onChangeValue: any,
    height: number,
    background: string,
    children?: string | JSX.Element | JSX.Element[],
    selectvalue: string,
    options: any,
    value: any,
    size: number,
    label: string
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
            <Typography letterSpacing={1} px={'3px'} mb={'3px'}
                sx={{
                    fontSize: {
                        lg: 18,
                        md: 14,
                        sm: 12,
                        xs: 11,
                    },

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
                        onBlur={onBlur}
                        value={value}
                        label={label}
                        IconComponent={() => (

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
                            </Box>
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