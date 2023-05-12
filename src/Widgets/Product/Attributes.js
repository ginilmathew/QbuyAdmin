import { Grid, Typography } from '@mui/material'
import React from 'react'
import CustomInputNormal from '@/components/CustomInputNormal'
import TagInput from '@/components/TagInput'
import CustomCheckBox from '@/components/CustomCheckBox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


const Attributes = ({item, index, onChange, enableVariant, removeAttributes}) => {

    console.log({item},'ITEM IN ')

    const saveTagValues = (value) => {
        onChange(value, index, 'options')
    }

  return (
    <Grid container spacing={2} py={1}>
        <Grid item xs={12} lg={2}>
            <CustomInputNormal
                onChangeValue={(e) => onChange(e.target.value, index, 'name')}
                disabled={false}
                type='text'
                placeholder={`Attribute Name`}
                view={false}
                defaultValue={item.name}
            />
        </Grid>
        <Grid item xs={12} lg={4}>
            
            <TagInput tagValues={(saveTagValues)} values={item?.options} />

        </Grid>
        <Grid item xs={12} lg={2}>
            <CustomCheckBox isChecked={item.variant} label='' onChange={(e) => enableVariant(e, index)} title='Add Variant' />
        </Grid>
        {removeAttributes && <Grid item xs={12} lg={2} display={"flex"} alignItems={"center"}>
            <DeleteOutlineIcon style={{ color: 'red' }} onClick={removeAttributes} />
        </Grid>}
    </Grid>
  )
}

export default Attributes