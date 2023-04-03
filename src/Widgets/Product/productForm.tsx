import { Box, Grid, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomImageUploader from '@/components/CustomImageUploader';
import CustomAutoComplete from '@/components/CustomAutocompleteBox';
const ProductForm = () => {

    const [franchise, setFranchise] = useState<string>('')
    const [stock, setStock] = useState<boolean>(false)
    const [imagefile, setImagefile] = useState<null | File>(null)

    const { register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue, } = useForm<FormInputs>();

    const onChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFranchise(e.target.value)
    }

    const StockCheck = (e: any) => {
        console.log({ e })
        setStock(e)
    }

    const imageUploder = (file: any) => {
        setImagefile(file)
        console.log({ file })
    }


    return (
        <Box>
            <CustomBox title='Product Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.name}
                            fieldName="name"
                            placeholder={``}
                            fieldLabel={"Product Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.storename}
                            fieldName="storename"
                            placeholder={``}
                            fieldLabel={"Store Name "}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.franchise}
                            fieldName="franchise"
                            placeholder={``}
                            fieldLabel={"Franchise"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.type}
                            fieldName="type"
                            placeholder={``}
                            fieldLabel={"Type"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={'category'}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.weight}
                            fieldName="weight"
                            placeholder={``}
                            fieldLabel={"Weight(kg)"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.model}
                            fieldName="model"
                            placeholder={``}
                            fieldLabel={"Model"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.width}
                            fieldName="width"
                            placeholder={`width`}
                            fieldLabel={"Dimensions"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.height}
                            fieldName="height"
                            placeholder={`Height`}
                            fieldLabel={"*"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.category}
                            fieldName="category"
                            placeholder={``}
                            fieldLabel={"Category"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={'category'}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Customselect>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.subcategory}
                            fieldName="subcategory"
                            placeholder={``}
                            fieldLabel={"SubCategory"}
                            selectvalue={""}
                            height={40}
                            label={''}
                            size={16}
                            value={'subcategory'}
                            options={''}
                            onChangeValue={onChangeSelect}
                            background={'#fff'}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Customselect>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.order}
                            fieldName="order"
                            placeholder={``}
                            fieldLabel={"Display Order(Homepage)"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={true} label='' onChange={() => null} title='Panda Suggestion' />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={stock} label='' onChange={StockCheck} title='Enable Stock' />
                    </Grid>
                    {stock &&
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.stock}
                                fieldName="stock"
                                placeholder={``}
                                fieldLabel={"Stock"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>}
                        <Grid item xs={12} lg={3}>
                            <CustomInput
                                type='text'
                                control={control}
                                error={errors.minquantity}
                                fieldName="minquantity"
                                placeholder={``}
                                fieldLabel={"Minimum Quantity (Optional)"}
                                disabled={false}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <CustomAutoComplete fieldLabel='Product Tag'/>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                        <CustomImageUploader
                            ICON={""}
                            error={errors.productimage}
                            fieldName="productimage"
                            placeholder={``}
                            fieldLabel={"Product Image"}
                            control={control}
                            height={130}
                            max={5}
                            onChangeValue={imageUploder}
                            preview={imagefile}
                            previewEditimage={""}
                            type={"file"}
                            background="#e7f5f7"
                            myid="contained-button-file"
                            width={"100%"}
                        />

                    </Grid>
                </Grid>
            </CustomBox>
        </Box>
    )
}

export default ProductForm
