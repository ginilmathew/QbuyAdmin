import { Box, Typography } from '@mui/material'
import React from 'react'


type Props = {
    fieldLabel: string,
    text: string,
    color?:string
}

const CustomViewInput = ({ fieldLabel, text,color }: Props) => {
    return (
        <Box>
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

            <Typography letterSpacing={.5} px={'3px'} mb={'3px'}
                sx={{
                    display: 'flex',
                    paddingLeft: 1,
                    width: '100%',
                    height: 40,
                    alignItems: 'center',
                    border: '1px solid #f5f5f5',
                    color:color ? color : '#000',
                    fontSize: {
                        lg: 16,
                        md: 14,
                        sm: 12,
                        xs: 11,
                    },
                    fontFamily: `'Poppins' sans-serif`,

                }}
            >{text}

            </Typography>
        </Box>
    )
}

export default CustomViewInput