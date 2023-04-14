import React, { memo, useCallback, useMemo, useState } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Admin_item, sales_item, Logs_item, support_item } from "../utilities/Menu_items"
import { Box, Collapse, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface props extends idprops {
    res: any,
    handleOpen: any,
    open: string
}

interface idprops {
    id?: string,
    handleClose?: any;
}

export const ListItems = ({ res, handleOpen, open, handleClose }: props) => {
    const router = useRouter()

    const [openc, setOpenC] = useState<string>("")


    const handleOpenC = (props: any) => {
        if (props.id === openc) {
            setOpenC("")
        } else {
            setOpenC(props?.id)
        }
    }

    const NavigatePath = (path: any) => {
        if (path) {
            router.push(path)
            handleClose()
        }
    }

    return (
        <>
            <ListItemButton onClick={handleOpen} sx={{height:30}}>
                <ListItemText><Typography fontSize={13} onClick={() => NavigatePath(res?.path && res?.path)} sx={{fontFamily:`'Poppins' sans-serif`,}}>{res?.item}</Typography></ListItemText>
                {(res?.list && res?.list?.length > 0) ? open === res?.id ? <ExpandLess /> : <ExpandMore /> : null}
            </ListItemButton>

            {res?.list && res?.list?.length > 0 &&
                <Collapse in={res?.id === open ? true : false}>
                    {res?.list?.map((itm: any, index: number) => (
                        <Box ml={2} key={index}>
                            <ListItems res={itm} handleOpen={() => handleOpenC(itm)} open={openc} handleClose={()=>handleClose()}/>
                        </Box>
                    ))}
                </Collapse>
            }
        </>
    )
}


const AdminLists = ({ id, handleClose }: idprops) => {

    const [open, setOpen] = useState<string>("")
    const [dataList, setDataList] = useState<any>(id === "Admin" ? Admin_item : id === "Sales" ? sales_item : id === "Logs" ? Logs_item : id === "Support" ? support_item : Admin_item);



    const handleOpen = (props: any) => {
        console.log({ props: props })
        if (props?.id === open) {
            setOpen("")
        } else {
            setOpen(props?.id)
        }
    }

    return (
        <>
            <List sx={{maxHeight:'90vh'}}>
                {dataList?.map((res: any, i: React.Key | null | undefined) => (
                    <ListItems res={res} handleOpen={() => handleOpen(res)} open={open} key={i} handleClose={()=>handleClose()} />
                ))}
            </List>
        </>
    )
}

export default AdminLists