import CustomLoginInput from '@/components/CustomLoginInput'
import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { useForm, SubmitHandler } from "react-hook-form";
import { Avatar, Box, Stack, styled, Typography } from '@mui/material';
// import banner from '../../public/images/Login.png'
// import panda from '../../public/images/panda.png'
import LockIcon from '@mui/icons-material/Lock';
import Custombutton from '@/components/Custombutton';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Login = () => {

    const router = useRouter();

    type Inputs = {
        email: string,
        password: string | number,
    };

    interface IFormInput {
        email: string,
        password: string | number,
    }

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>();

    const BOX = styled(Box)({
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${`/images/login.png`})`,
        alignItems: 'center',
        justifyContent: 'center',
        objectFit: 'contain',
        display: 'flex',
        flexDirection: 'column'
    })

    const onSubmit: SubmitHandler<IFormInput> = data => router.push('/dashboard');


    return (
        <BOX>
            <Stack justifyContent={'center'} alignItems={'center'} gap={2}>

                <Image
                    // loader={myLoader}
                    src='/images/panda.png'
                    alt="Picture of the author"
                    width={100}
                    height={100}
                />
                <Typography letterSpacing={1} fontSize={14}>Please enter your login details</Typography>
                <CustomLoginInput
                    type='text'
                    Icon={PersonIcon}
                    control={control}
                    error={errors.email}
                    fieldName="enter your email"
                    placeholder={`Username`}
                />
                <CustomLoginInput
                    type='password'
                    Icon={LockIcon}
                    control={control}
                    error={errors.password}
                    fieldName="password"
                    placeholder={`Password`}
                />
                <Custombutton
                    btncolor=''
                    height={40}
                    IconEnd={""}
                    IconStart={''}
                    startIcon={false}
                    endIcon={false}
                    onClick={handleSubmit(onSubmit)}
                    label='login' />
            </Stack>
        </BOX>
    )
}

export default Login