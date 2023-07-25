import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Typography } from '@mui/material';

type props = {
    list: any,
    onChangeValue: any;
    fieldLabel: string;
    value?: any
}

export default function CustomSingleSearch({ list, onChangeValue, fieldLabel, value }: props) {
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
        </>

    );
}


