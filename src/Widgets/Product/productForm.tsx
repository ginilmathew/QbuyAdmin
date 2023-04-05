import { Box, Divider, Grid, MenuItem, Typography } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import CustomBox from '../CustomBox'
import CustomInput from '@/components/CustomInput'
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInputs } from '@/utilities/types';
import Customselect from '@/components/Customselect';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomImageUploader from '@/components/CustomImageUploader';
import CustomAutoComplete from '@/components/CustomAutocompleteBox';
import CustomTimepicker from '@/components/CustomTimepicker';
import { GoogleMap, Polygon, useJsApiLoader, LoadScript, Marker, DrawingManager } from "@react-google-maps/api";
import { CustomMultipleImageUploader } from '@/components/CustomMultipleImageUploder';
import Custombutton from '@/components/Custombutton';
import AddIcon from '@mui/icons-material/Add';
import CustomProductVarient from './CustomProductVarient';

const ProductForm = () => {

    const [franchise, setFranchise] = useState<string>('')
    const [stock, setStock] = useState<boolean>(false)
    const [addvarient, setAddVarient] = useState<boolean>(false)
    const [imagefile, setImagefile] = useState<null | File>(null)
    const [attributes, setAttributes] = useState<any>([])
    const [productTag, setProductTag] = useState<any>([])
    const [productTagValue, setProductTagValue] = useState<any>([])
    const [attributeTag, setattributeTag] = useState<any>([])
    const [attributeTagValue, setattributeTagValue] = useState<any | null>(null)
    const [index, setIndex] = useState<number>(0)
    const [confirmbtn, setConfirmBtn] = useState(false)
    const [varients, setVarients] = useState<any>([])


    console.log({ varients })



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


    const containerStyle = {
        width: "100%",
        height: "300px",
    };

    const center = {
        lat: 37.7749,
        lng: -122.4194,
    };



    const [path, setPath] = useState([
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
    ]);

    // Define refs for Polygon instance and listeners
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

    // Call setPath with new edited path
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng: google.maps.LatLng) => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
        }
    }, [setPath]);

    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
        (polygon: google.maps.Polygon) => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );

    // Clean up refs
    const onUnmount = useCallback(() => {
        listenersRef.current.forEach((lis: google.maps.MapsEventListener) => lis.remove());
        polygonRef.current = null;
    }, []);


    const imageUploder = (file: any) => {
        setImagefile(file)
        console.log({ file })
    }


    const addAtributes = () => {
        // if(attributes?.length  < 2){
        setAttributes([...attributes, { name: '', content: [], varient: false }])
        // }
    }

    const onChangeName = (e: any, i: number) => {
        console.log(e.target.value)
        attributes[i].name = e.target.value;
        console.log({ attributes })

    }

    const onChangeOptions = (e: any, i: number) => {
        setIndex(i)
        console.log({ e }, 'numer CONSOLE')
        console.log({ attributes })

    }


    useEffect(() => {

        if (attributeTagValue?.length) {
            attributes[index].content = [...attributeTagValue]
        }


    }, [attributeTagValue])


    const AddVarientCheckbox = (e: any, i: number) => {
        console.log({ e }, 'EVENT CONSOLE')
        setIndex(i)
        setAddVarient(e)
        attributes[i].varient = e;
        console.log({ attributes })


    }

    const ConfirmVarients = () => {
        setConfirmBtn(true)

        // const attributeContent = [];
        // for (let i = 0; i < attributes?.length; i++) {
        //     attributeContent[i] = attributes[i].content;
        // }

        // console.log({attributeContent})
        // for (let i = 0; i < attributeContent[0]?.length; i++) {
        //     for (let j = 0; j < attributeContent[1]?.length; j++) {
        //         for (let k = 0; k < attributeContent[2]?.length; k++) {
        //             for (let l = 0; l < attributeContent[3]?.length; l++) {
        //                 let outputString = attributeContent[0][i].title + " " + attributeContent[1][j].title + " " + attributeContent[2][k].title + " " + attributeContent[3][l].title;
        //                 for (let m = 0; m < attributeContent[3]?.length; m++) {
        //                     outputString += " " + attributeContent[3][m].title;
        //                     console.log({ outputString });
        //                 }
        //             }
        //         }
        //     }
        // }


        //loop all attributes

        // let output = [];


        // const numIterations = attributes.reduce((acc:any, curr:any) => acc * curr.content.length, 1);

        // for (let i = 0; i < numIterations; i++) {
        //     let combination = "";
        //     let remainder = i;
        //     for (let j = attributes.length - 1; j >= 0; j--) {
        //         const contentIndex = remainder % attributes[j].content.length;
        //         combination = attributes[j].content[contentIndex].title + " " + combination;
        //         remainder = Math.floor(remainder / attributes[j].content.length);
        //     }

        //     console.log()
        //     // output += combination.trim() + "\n";
        //     output.push(combination.trim());
        //     // output += combination

        // }

        // setVarients(output)



        const output = [];
        setVarients([])
        // Filter attributes array to only include those with variant true
        const variantAttributes = attributes.filter((attr: any) => attr.varient !== false)

        console.log({ variantAttributes })

        // Calculate the number of iterations required based on the length of the variantAttributes array
        const numIterations = variantAttributes.reduce((acc: any, curr: any) => acc * curr?.content?.length, 1);

        for (let i = 0; i < numIterations; i++) {
            let combination = "";
            let remainder = i;
            for (let j = variantAttributes.length - 1; j >= 0; j--) {
                const contentIndex = remainder % variantAttributes[j].content?.length;
                combination = variantAttributes[j].content[contentIndex].title + " " + combination;
                remainder = Math.floor(remainder / variantAttributes[j].content?.length);
            }
            output.push(combination.trim());
        }
        setVarients(output)
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
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.storename}
                            fieldName="storename"
                            placeholder={``}
                            fieldLabel={"Store Name"}
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
                            error={errors.franchise}
                            fieldName="franchise"
                            placeholder={``}
                            fieldLabel={"Franchise"}
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
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.description}
                            fieldName="description"
                            placeholder={``}
                            fieldLabel={"Product Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />

                    </Grid>

                    <Grid item xs={12} lg={1.5}>
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
                    <Grid item xs={12} lg={1.5}>
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
                    <Grid item xs={12} lg={1.5}>
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
                    <Grid item xs={12} lg={1.5}>
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
                        <CustomAutoComplete fieldLabel='Product Tag' list={productTag} setValues={setProductTagValue} onChnageValues={() => null} />
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
            <CustomBox title='Delivery Details'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={1.8}>
                        <CustomTimepicker
                            changeValue={() => null}
                            fieldName='pickupTime'
                            control={control}
                            error={errors.pickupTime}
                            fieldLabel={'Product Availibility'} />
                    </Grid>
                    <Grid item xs={12} lg={1.8}>
                        <Typography mb={3}></Typography>
                        <CustomTimepicker
                            changeValue={() => null}
                            fieldName='dropTime'
                            control={control}
                            error={errors.dropTime}
                            fieldLabel={''} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography mb={3}></Typography>
                        <CustomCheckBox isChecked={true} label='' onChange={() => null} title='Requires Shipping' />
                    </Grid>
                </Grid>
                <Box py={2}>
                    <Divider />
                    <Box py={1}>
                        <LoadScript googleMapsApiKey='AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I' libraries={['drawing', 'geometry']} >
                            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}
                            >

                                <Polygon
                                    // Make the Polygon editable / draggable
                                    editable
                                    draggable
                                    path={path}
                                    // Event used when manipulating and adding points
                                    onMouseUp={onEdit}
                                    // Event used when dragging the whole Polygon
                                    onDragEnd={onEdit}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                    options={
                                        {
                                            clickable: true
                                        }
                                    }
                                />
                            </GoogleMap>
                        </LoadScript>
                    </Box>
                </Box>
            </CustomBox>
            <CustomBox title='offers & Promotions'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Product offer"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Offer Description"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Coupon Name"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <Customselect
                            type='text'
                            control={control}
                            error={errors.subcategory}
                            fieldName="subcategory"
                            placeholder={``}
                            fieldLabel={"Coupon Type"}
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
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Coupon Value"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Coupon Code"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Additional Options'>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Meta Tags"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Tax Class"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <CustomInput
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Product Video Link"}
                            disabled={false}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomMultipleImageUploader fieldLabel='Add Additional Images' />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CustomInput
                            disabled={false}
                            type='text'
                            control={control}
                            error={errors.product_offer}
                            fieldName="product_offer"
                            placeholder={``}
                            fieldLabel={"Related Products"}
                            view={false}
                            defaultValue={''}
                        />
                    </Grid>
                </Grid>
            </CustomBox>
            <CustomBox title='Attributes'>
                <Custombutton btncolor='' height={40} endIcon={false} startIcon={true} label={'Add'} onClick={addAtributes} IconEnd={''} IconStart={AddIcon} />


                {attributes && attributes?.map((res: any, i: any) => (<>
                    <Grid container spacing={2} py={1}>
                        <Grid item xs={12} lg={2}>
                            <CustomInput
                                onChangeValue={(e: any) => onChangeName(e, i)}
                                disabled={false}
                                type='text'
                                control={control}
                                error={errors.atrributeName}
                                fieldName="atrributeName"
                                placeholder={``}
                                fieldLabel={"Name"}
                                view={false}
                                defaultValue={''}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <CustomAutoComplete fieldLabel='Attribute Options' list={attributeTag} setValues={setattributeTagValue} onChnageValues={(e: any) => onChangeOptions(e, i)} />

                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <Typography mb={3}></Typography>
                            <CustomCheckBox isChecked={attributes[i].varient} label='' onChange={(e: any) => AddVarientCheckbox(e, i)} title='Add Variant' />
                        </Grid>
                    </Grid>
                </>
                ))}
                {attributes?.length > 0 &&
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <Custombutton btncolor='' height={40} endIcon={false} startIcon={false} label={'confirm'} onClick={ConfirmVarients} IconEnd={''} IconStart={''} />
                    </Box>}
            </CustomBox>
            {confirmbtn &&
                <CustomBox title='Add Variant & Price'>
                    {attributes?.every((res: any) => res.varient === false) && confirmbtn &&
                        <Grid container spacing={2}>
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.product_offer}
                                    fieldName="product_offer"
                                    placeholder={``}
                                    fieldLabel={"Selling Price"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.product_offer}
                                    fieldName="product_offer"
                                    placeholder={``}
                                    fieldLabel={"Offer Price"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.product_offer}
                                    fieldName="product_offer"
                                    placeholder={``}
                                    fieldLabel={"Purchase Price"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>

                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.product_offer}
                                    fieldName="product_offer"
                                    placeholder={``}
                                    fieldLabel={"Offer From"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.product_offer}
                                    fieldName="product_offer"
                                    placeholder={``}
                                    fieldLabel={"Offer To"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <CustomInput
                                    disabled={false}
                                    type='text'
                                    control={control}
                                    error={errors.product_offer}
                                    fieldName="product_offer"
                                    placeholder={``}
                                    fieldLabel={"Stock"}
                                    view={false}
                                    defaultValue={''}
                                />
                            </Grid>
                        </Grid>}
                    {attributes?.some((res: any) => res.varient === true) && confirmbtn &&
                        <Box>
                            {varients?.map((res: any, i: any) => (
                                <CustomProductVarient content={res} index={i + 1} />
                            ))}
                        </Box>
                    }
                </CustomBox>}
            <Box py={3}>
                <Custombutton btncolor='' IconEnd={''} IconStart={''} endIcon={false} startIcon={false} height={''} label={'Add Product'} onClick={() => null} />
            </Box>
        </Box>
    )
}

export default ProductForm
