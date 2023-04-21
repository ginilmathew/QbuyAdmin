import { Grid, Typography } from '@mui/material'
import React from 'react'
import CustomInputNormal from '@/components/CustomInputNormal'
import TagInput from '@/components/TagInput'
import CustomCheckBox from '@/components/CustomCheckBox';


const Attributes = ({item, index, onChange, enableVariant}) => {

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
            
            <TagInput tagValues={(saveTagValues)} />

        </Grid>
        <Grid item xs={12} lg={2}>
            <CustomCheckBox isChecked={item.varient} label='' onChange={(e) => enableVariant(e, index)} title='Add Variant' />
        </Grid>
    </Grid>
  )
}

export default Attributes