import { Box, TextField, Typography } from '@mui/material'
import { type } from 'os'
import React, { useState, useEffect } from 'react'

type props = {
  tagValues: any,
  values: any,
  setState: any,
  fieldLabel: string
}

const CustomTagInputValue = ({ tagValues, values, setState, fieldLabel }: props) => {




  const [tags, setTags] = useState<any>(values ? values : [])
  const [value, setValue] = useState('')


  const submitvalues = (e: any) => {
    if (e.key === 'Enter') {
      setTags((prev: any) => {
        tagValues([...prev, e.target.value])
        return [...prev, e.target.value]
      })
      setValue('')

    }
  }

  const changeValues = (e: any) => {
    setValue(e.target.value);
  }


  const removeTag = (index: any) => {
    let tagas = tags.filter((tag: any, i: number) => tag !== index);
    setTags(tagas)
    setState(tagas)
  }

  useEffect(() => {
    if (values) {
      setTags(values)
    }
  }, [values])

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
      <Box style={{ border: '0.5px solid black', minHeight: 25, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField id="outlined-basic" label="" variant="outlined" type='text'
          value={value}
          onChange={changeValues}
          onKeyDown={submitvalues}
          placeholder='Options'
          InputProps={{
            style: { height: 30, margin: 5, minWidth: 100, border: '0.2px solid gray' }
          }}
        />
        {tags?.map((tag: any, index: number) => <Box key={index} style={{ backgroundColor: '#ebf0f7', padding: 5, margin: 2, display: 'flex', flexDirection: 'row', height: 30, fontSize: 12, alignItems: 'center' }}>
          <span>{tag}</span>
          <span style={{ marginLeft: 5, marginRight: 5, color: 'red', cursor: 'pointer' }} onClick={() => removeTag(tag)} >X</span>
        </Box>)}

      </Box>
    </>

  )
}

export default CustomTagInputValue