import React, { useTransition ,memo} from 'react'
import TextField from "@mui/material/TextField";
import { InputAdornment } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

type props = {
    setState: any
}



const CutomSearch = ({setState}:props) => {

    const [pending, startTransition] = useTransition();

    const onchangeValue = (e:any) => {
        startTransition(() => {
            setState(e.target.value)
        })
    }
    return (
        <>
            <TextField
                onChange={onchangeValue}
                placeholder='Serach...'
                id="outlined-basic" variant="outlined"
                InputProps={{
                    style: {
                        fontFamily: `'Poppins' sans-serif`,
                        height: 40
                    },
                    endAdornment: <InputAdornment position="end"><SearchOutlinedIcon /></InputAdornment>

                }} />
        </>
    )
}

export default CutomSearch