import { Box, TextField } from '@mui/material'
import { type } from 'os'
import React,{useState} from 'react'

type props ={
  tagValues:any,
  values:any
}

const CustomTagInputValue = ({tagValues,values}:any) => {
  const [tags, setTags] = useState<any>(values ? [...values] : [])
  const [value, setValue] = useState('')

  console.log({tags})

  const submitvalues = (e:any) => {
      if (e.key === 'Enter') {
          setTags((prev:any) => {
              tagValues([...prev, e.target.value])
              return [...prev, e.target.value]
          })
          setValue('')

      }
  }

  const changeValues = (e:any) => {
      setValue(e.target.value);
  }


  const removeTag = (index:any) => {
      let tagas = tags.filter((tag:any, i:number) => i !== index);
      setTags(tagas)
  }
  return (
    <Box style={{ border: '0.5px solid black', minHeight: 30, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField id="outlined-basic" label="" variant="outlined" type='text'
                value={value}
                onChange={changeValues}
                onKeyDown={submitvalues}
                placeholder='Options'
                style={{ height: 30, margin: 5, minWidth: 100, border: '0.2px solid gray' }} />

    </Box>
  )
}

export default CustomTagInputValue