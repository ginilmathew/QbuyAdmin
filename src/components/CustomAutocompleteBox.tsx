import React,{useEffect} from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography, styled } from '@mui/material'

type props = {
    fieldLabel: string
    list: any,
    setValues: any
    onChnageValues: any,
    res?:any,
    vres?:any
}


export default function CustomAutoComplete({ fieldLabel, list, setValues, onChnageValues ,res,vres}: props) {
    const AutoCompleteStyled = styled(Autocomplete)`
  & .MuiInputBase-input {
    height: 1.5rem;
  }
`;


    // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top



    const fixedOptions = [list];
    const [value, setValue] = React.useState([list]);
    const [items, setItems] = React.useState('')


 
    useEffect(() => {
        if(res){
            setValue(res?.meta_tags?.map((res: any) => ({
                title: res
            })))
        }
    }, [res])

    // useEffect(() => {
    //     if(vres){
    //         setValue(vres?.map((res: any) => ({
    //             title: res
    //         })))
    //     }
    // }, [vres])


  
    

    const onChangeValue = (e: any) => {

        let filter = list.map((res: any) => (
            res?.title
        ))
        let data = e.target.value.trim().split(',')
        const find = filter.includes(data[0])
        if (find) {
            return false;
        } else {
            let value = { title: data[0] }
            list.push(value)
        }
    }

    const ChangedValue = (e: any, newValue: any) => {
        setValues([...newValue.filter((option: any) => fixedOptions.indexOf(option) === -1),]);
        setValue([
            ...newValue.filter((option: any) => fixedOptions.indexOf(option) === -1),
        ]);
    }

 

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
                sx={{
                    "& .MuiInputBase-input": {
                        height: "8px"
                    }


                }}
                multiple
                id="fixed-tags-demo"
                value={value}
                onChange={(event, newValue) => {
                    console.log(event)
                    ChangedValue(event, newValue)

                }}
                defaultValue={list.title}
                options={list}
                getOptionLabel={(option) => option.title}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <>
                            {list?.length > 0 &&
                                <Chip

                                    label={option?.title}
                                    {...getTagProps({ index })}
                                // disabled={fixedOptions.indexOf(option) !== -1}
                                />}
                        </>


                    ))
                }
                style={{ width: '100%', }}
                renderInput={(params) => (
                    <TextField {...params} placeholder="" sx={{
                        "& .MuiInputBase-input": {
                            height: "8px"
                        }


                    }} onChange={(e) => {
                        onChangeValue(e)
                        onChnageValues(e)
                    }} />
                )}
            />
        </>

    );
}

