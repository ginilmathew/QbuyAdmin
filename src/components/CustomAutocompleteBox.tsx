import * as React from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography } from '@mui/material'

type props = {
    fieldLabel: string
}


export default function CustomAutoComplete({ fieldLabel }: props) {


    // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
    const top100Films = [
        { title: 'The Dark' },
        { title: 'The Godfather' },
        { title: 'The Godfather: Part II' },
        { title: 'The Dark Knight' },
        { title: '12 Angry Men' },
        { title: "Schindler's List" },
        { title: 'Pulp Fiction' },
        {
            title: 'The Lord of the Rings: The Return of the King',

        },

    ];
    const fixedOptions = [top100Films[0]];
    const [value, setValue] = React.useState([top100Films[3]]);
    const [items, setItems] = React.useState('')


    const onChangeValue = (e: any) => {
        let filter = top100Films.map((res) => (
            res?.title
        ))
        let data = e.target.value.trim().split(',')
        const find = filter.includes(data[0])
        if (find) {
            return;
        } else {
            let value = { title: data[0] }
            console.log({ value })
            top100Films.push(value)
        }
    }

    const ChangedValue = (e: any, newValue: any) => {

        console.log({ e: e.target.value })

        setValue([
            ...newValue.filter((option: any) => fixedOptions.indexOf(option) === -1),
        ]);
    }

    return (

        <>
            <Typography letterSpacing={1} px={'3px'} mb={'3px'}
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
                id="fixed-tags-demo"
                value={value}
                onChange={(event, newValue) => {
                    console.log(event)
                    ChangedValue(event, newValue)

                }}
                options={top100Films}
                getOptionLabel={(option) => option.title}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            label={option.title}
                            {...getTagProps({ index })}
                            disabled={fixedOptions.indexOf(option) !== -1}
                        />
                    ))
                }
                style={{ width: '100%' }}
                renderInput={(params) => (
                    <TextField {...params} placeholder="" onChange={onChangeValue} />
                )}
            />
        </>

    );
}

