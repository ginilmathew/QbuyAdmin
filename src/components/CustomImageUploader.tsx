import React from 'react'
import { Avatar, Box, FormGroup, Input, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { styled } from '@mui/material/styles';
import BackupIcon from '@mui/icons-material/Backup';

import { Padding, WidthFull } from '@mui/icons-material';
import Image from 'next/image';

type props = {
    fieldName: string,
    control: any,
    fieldLabel: string,
    placeholder: string,
    error: any,
    type: string,
    max: number,
    onChangeValue: any,
    height: number,
    background: string,
    ICON: any,
    width: string | number,
    preview: any,
    previewEditimage: any,
    myid: string,
    viewImage?: any

}





const CustomImageUploader = ({
    fieldName,
    control,
    fieldLabel,
    placeholder,
    error,
    type,
    max,
    onChangeValue,
    height,
    background,
    ICON,
    width,
    preview,
    previewEditimage,
    myid, 
    viewImage
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
                    render={({ field: { onChange, onBlur, value } }) =>
                        <Box sx={{ height: height ? height : 150, border: '1px solid #f5f5f5', width: width ? width : "50%", position: 'relative', fontFamily: `'Poppins' sans-serif`, }} >
                            <Avatar src={viewImage ? viewImage : preview ? URL?.createObjectURL(preview):''} style={{ width: '100%', height: '100%' }} variant="square"></Avatar>

                            <label htmlFor={myid} >
                                <Input
                                     
                                    style={{ display: 'none' }}
                                    onBlur={onBlur}
                                    aria-invalid={error ? "true" : "false"}
                                    className="form-control"
                                    placeholder={placeholder}
                                    type={'file'}
                                    id={myid}
                                    inputProps={{accept:"image/png, image/jpeg ,image/webp"}}
                                    onChange={onChangeValue ? (e: any) =>  onChangeValue(e.target.files[0]) : onChange}
                                />
                                <BackupIcon style={{
                                    color: "#58D36E",
                                    cursor: "pointer",
                                    zIndex: "99",
                                    position: "absolute",
                                    justifyContent: 'center',
                                    borderRadius: "3px",
                                    left: '44%',
                                    top: '40%'


                                }} fontSize={"large"} />
                            </label>
                        </Box>
                    }
                />
                {error && <p role="alert" style={{
                    color: "red",
                    display: "flex",
                    paddingLeft: "10px",
                    fontSize: "12px"
                }}>{error?.message}</p>}
            </FormGroup>
        </>
    )
}

export default CustomImageUploader