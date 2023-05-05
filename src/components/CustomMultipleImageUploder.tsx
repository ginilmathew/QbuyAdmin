
import React from 'react';
import ImageUploading from 'react-images-uploading';
import { Avatar, Box, FormGroup, styled, Typography, Button } from "@mui/material";
import Custombutton from './Custombutton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { AnyARecord } from 'dns';
import { error } from 'console';


const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5242880; // 5 MB in bytes

type props = {
    fieldLabel: string
    onChangeImage?: any,
    state: any,
}

export const CustomMultipleImageUploader = ({ fieldLabel, onChangeImage, state }: props) => {
    // const [images, setImages] = React.useState([]);
    const maxNumber = 10;


    // const onChangeImage = (imageList: any, addUpdateIndex: any) => {
    //     // data for submit
    //     console.log(imageList, addUpdateIndex);
    //     setImages(imageList);
    // };
    const MAX_FILE_SIZE = 1024000;
    return (
        <>
            <ImageUploading
                multiple
                value={state}
                maxFileSize={MAX_FILE_SIZE}
                onChange={onChangeImage}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                    errors
                }) => (
               
                    <Box >
                        
                        <Box py={1} display={'flex'} justifyContent={'space-between'}>
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
                            <Custombutton
                                btncolor=''
                                height={30}
                                IconEnd={""}
                                IconStart={''}
                                startIcon={false}
                                endIcon={false}
                                onClick={onImageUpload}
                                label='Upload Images' />
                        </Box>
                        <Box minHeight={150} border={'1px solid #f5f5f5'} >
                            <Box display={'flex'} flexWrap={'wrap'} justifyContent={'initial'}>
                                {imageList?.map((image, index) => (
                                    <Box key={index} display={'flex'} px={1} py={2}>
                                        <Box display={'flex'} flexDirection={'column'}  >
                                            <img src={image['data_url']} alt="" width="100px" height={'80px'} />
                                            <Box display={'flex'} py={1} gap={2}>
                                                <DeleteOutlineIcon onClick={() => onImageRemove(index)} sx={{ color: 'red', cursor: 'pointer' }} />
                                                <BorderColorIcon onClick={() => onImageUpdate(index)} sx={{ color: '#58d36e', cursor: 'pointer' }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        {errors && 
                        <>
                        {errors?.maxNumber && <span style={{fontSize:'12px',color:'red'}} >Number of selected images exceed maxNumber</span>}
                          {errors?.maxFileSize && <span style={{fontSize:'12px',color:'red'}} >Selected file size exceed maxFileSize(1MB)</span>}
                        </>}
                    </Box>
                     
                    
                )}
             
              
              
            </ImageUploading>
        </>
    );
};
