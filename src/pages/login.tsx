import CustomLoginInput from '@/components/CustomLoginInput'
import React, { useState, useContext } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { useForm, SubmitHandler } from "react-hook-form";
import { Avatar, Box, Stack, styled, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Custombutton from '@/components/Custombutton';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { postData } from '@/CustomAxios';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import UserContext from '@/helpers/user';
import { signIn } from 'next-auth/react'
import { useSession } from "next-auth/react"


const Login = () => {

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false)
    const userContext = useContext(UserContext);

    const { data: session } = useSession()


    type Inputs = {
        email: string,
        password: string | number,
    };

    interface IFormInput {
        email: string,
        password: string | number,
    }


    const schema = yup
        .object()
        .shape({
            email: yup.string().email().required('Email is required'),
            password: yup.string()
                .required('No password provided.')
                .min(6, 'Password is too short')
        })
        .required();


    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<Inputs>({
            resolver: yupResolver(schema),
        });

    const BOX = styled(Box)({
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${`/images/login.png`})`,
        alignItems: 'center',
        justifyContent: 'center',
        objectFit: 'contain',
        display: 'flex',
        flexDirection: 'column'
    })


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
                callbackUrl: `${window.location.origin}`,
            });

            if (res?.error) {
                toast.error(res.error)
            } else {
                
                
    
        
                if (res?.url) {
                    //auth.setUser(session?.user)
                    console.log("in")
                    //router.push('/home');
                    router.push(res?.url);
                }
                else{
                    //console.log({sessions: session})
                    router.push('/');
                }
            }
        } catch (error) {
            console.log({error})
        }
        // try {
        //     setLoading(true)
        //     const response = await postData('/auth/login', data)
        //     await localStorage.setItem("user", JSON.stringify(response?.data?.user));
        //     await localStorage.setItem("token", response?.data?.access_token);
        //     await userContext.setUser(response?.data?.user)
            
        //     router.push('/dashboard')
        //     toast.success(`Login Successfull`);
        // } catch (error: any) {
        //     toast.error(error?.message);
        //     setLoading(false)
        // } finally {
        //     setLoading(false)
        // }
    }


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
                    fieldName="email"
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
                    disabled={loading}
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

Login.auth = true