import { Box, Typography } from '@mui/material'
import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

type props = {
    heading: string
}


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export const options = {
    responsive: true,
    // maintainAspectRatio: false,


    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
            // text: 'Chart.js Bar Chart',
        },
    },
};

const labels = ['2020', '2021', '2022', '2023', '2024',];

export const data = {
    labels,
    datasets: [
        {
            label: '1',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 7000 })),
            backgroundColor: '#2896E9',
        },
        {
            label: '2',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 7000 })),
            backgroundColor: '#AE4AFA',
        },
    ],
};


const Profitchart = ({ heading }: props) => {
    let texttruncate = heading.slice(0, 3);
    let custtext = heading.slice(3)
    return (
        <>
            <Box bgcolor={"#fff"} borderRadius={1} boxShadow={1} px={2} py={1} >
                <Typography fontSize={14}> <span style={{ borderBottom: '3px solid #517ded', paddingBottom: 2, marginBottom: 1 }} >{texttruncate}</span>{custtext} </Typography>
                <Bar options={options} data={data} height="210" max-height="210" width="0" />
            </Box>

        </>
    )
}

export default Profitchart