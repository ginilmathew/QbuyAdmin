import React from 'react'
import TextField from "@mui/material/TextField";
import { InputAdornment } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const CutomSearch = () => {
    return (
        <>
            <TextField
                placeholder='Serach...'
                id="outlined-basic" variant="outlined"
                InputProps={{
                    style: {
                        fontFamily:`'Poppins' sans-serif`,
                        height: 40
                    },
                    endAdornment: <InputAdornment position="end"><SearchOutlinedIcon /></InputAdornment>

                }} />
        </>
    )
}

export default CutomSearch