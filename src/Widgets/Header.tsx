import { Avatar, Box, Tooltip, Typography } from '@mui/material'
import React, { useCallback, useState, useContext } from 'react'
import KeyIcon from '@mui/icons-material/Key';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { JsxElement } from 'typescript';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { support_item } from '../utilities/Menu_items'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Menus from './Menu';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UserContext from '@/helpers/user';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

const Header = () => {


  const router = useRouter()
  const userContext = useContext(UserContext);
  const { data: session, status } = useSession()




  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);
  const [anchorE3, setAnchorE3] = React.useState<null | HTMLElement>(null);
  const [anchorE4, setAnchorE4] = React.useState<null | HTMLElement>(null);
  const [unique, setUique] = useState<string>("")



  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const open3 = Boolean(anchorE3);
  const open4 = Boolean(anchorE4);


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClick3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE3(event.currentTarget);
  };
  const handleClick4 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE4(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setAnchorE2(null);
    setAnchorE3(null);
    setAnchorE4(null);
  }, [anchorEl, anchorE2, anchorE3, anchorE4])

  const Menudropdown = useCallback((e: React.MouseEvent<HTMLButtonElement>, value: string) => {
    switch (value) {
      case 'Admin':
        setUique(value)
        handleClick(e)
        break;
      case "Sales":
        handleClick2(e)
        setUique(value)
        break;
      case "Logs":
        handleClick3(e)
        setUique(value)
        break;
      case "Support":
        handleClick4(e)
        setUique(value)
        break;
      default:
        break;
    }
  }, [])

  const Homenavigation = () => {
    router.push('/dashboard')
  }

  const LogoutAll = useCallback(async () => {

    await localStorage.clear();
    userContext.setUser(null)
    signOut({ callbackUrl: "/login" })
    // router.push('/login')
  }, [])




  return (
    <Box
      height={80}
      bgcolor={'#fff'}
      px={5}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      position={'fixed'}
      width={'100vw'}
      zIndex={100} >
      <Image
        style={{ cursor: 'pointer' }}
        onClick={Homenavigation}
        // loader={myLoader}
        src='/images/panda.png'
        alt="Picture of the author"
        width={60}
        height={60}
      />

      <Menus

        unique={unique}
        open={open}
        handleClose={handleClose}
        anchorEl={anchorEl}
        text={"Admin"}
        ArrowIcon={KeyboardArrowDownIcon}
        Icon={KeyIcon}
        onClick={(e: any) => {
          Menudropdown(e, "Admin")
        }}
        id={'admin'}
      />

      <Menus
        unique={unique}
        open={open2}
        handleClose={handleClose}
        anchorEl={anchorE2}
        text={"Sales"}
        ArrowIcon={KeyboardArrowDownIcon}
        Icon={SignalCellularAltIcon}
        onClick={(e: any) => {
          Menudropdown(e, "Sales")
        }}
        id={'sales'} />

      <Menus
        unique={unique}
        text={"Logs"}
        open={open3}
        handleClose={handleClose}
        anchorEl={anchorE3}
        ArrowIcon={KeyboardArrowDownIcon}
        Icon={AssignmentOutlinedIcon}
        onClick={(e: any) => {
          Menudropdown(e, "Logs")
        }}
        id={"logs"}
      />
      <Menus
        unique={unique}
        open={open4}
        handleClose={handleClose}
        anchorEl={anchorE4}
        text={"Support"}
        ArrowIcon={KeyboardArrowDownIcon}
        Icon={HeadsetMicIcon}
        onClick={(e: any) => {
          Menudropdown(e, "Support")
        }}
        id={'support'}
      />

      <Box display={'flex'} gap={1} >
        <Box width={140} height={50} sx={{ background: '#58d36e' }} borderRadius={10} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box px={1.5}>
            <Typography sx={{ fontFamily: `'Poppins' sans-serif`, }}>{userContext?.user?.name}</Typography>
            <Typography fontSize={12} color={'#fff'} sx={{ fontFamily: `'Poppins' sans-serif`, }}>{userContext?.user?.role}</Typography>
          </Box>
          <Avatar sx={{ height: 40, borderRadius: 10 }}></Avatar>
        </Box>
        <Box width={50} height={50} borderRadius={12} sx={{ background: '#58d36e', cursor: 'pointer' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <NotificationsIcon sx={{ color: "#fff" }} />
        </Box>
        <Box width={50} height={50} borderRadius={12} sx={{ cursor: 'pointer' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Tooltip title="Are you sure you want to log out?">
            <LogoutIcon sx={{ fontWeight: 'bold' }} onClick={LogoutAll} />
          </Tooltip>

        </Box>
      </Box>
    </Box>
  )
}

export default Header