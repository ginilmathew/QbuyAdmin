import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Box, Typography } from '@mui/material'
import { green } from "@mui/material/colors";
interface CheckboxProps {
    label: string;
    isChecked: boolean;
    title: string;
    onChange: (checked: boolean) => void;
}

const CustomCheckBox = (props: CheckboxProps) => {
    const { label, isChecked, onChange, title } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <Box display={'flex'} gap={2} alignItems={'center'}>
            <Checkbox
                sx={{
                    color: green[800],
                    '&.Mui-checked': {
                      color: green[600],
                    },
                  }}
                checked={isChecked}
                onChange={handleChange}
                inputProps={{ "aria-label": label }}
            />
            <Typography variant="body1" color="initial">{title}</Typography>
        </Box>
    );
};

export default CustomCheckBox;