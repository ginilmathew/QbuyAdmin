import { Autocomplete, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'



type props = {
    fieldLabel: any,
    list: any,
    onChange:any
}



const CustomAutoCompleteSearch = ({ fieldLabel, list ,onChange}: props) => {

   

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
                multiple
                defaultValue={list[1]}
                id="multiple-limit-tags"
                options={list}
                onChange={(event, newValue) => {
                    onChange(newValue)
                  

                }}
                getOptionLabel={(option:any) => option.title}
                style={{ width: '100%', }}
                renderInput={(params) => (
                    <TextField {...params} label="" placeholder="products" sx={{
                        "& .MuiInputBase-input": {
                            height: "8px"
                        }


                    }} />
                )}
                sx={{ width: '500px' }}
            />

        </>
    )
}

export default CustomAutoCompleteSearch