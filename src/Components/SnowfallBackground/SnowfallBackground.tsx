import React from "react";
import Snowfall from 'react-snowfall';
import {useColorMode} from '@chakra-ui/react';
import moment from 'moment';
import {Functions} from '../../utils/functions';
import getRandomInt = Functions.getRandomInt;

const snowflake = document.createElement('img');
snowflake.src = `${window.location.href}/snowflake.png`;

const SnowfallBackground = () => {
    const {colorMode} = useColorMode();
    const isChristmas = /*December*/ (moment().month() === 11) ||
        /*November, 18th or +*/ (moment().month() === 10 && moment().day() > 17) ||
        /*January, 15th or -*/ (moment().month() === 0 && moment().day() < 16);

    return isChristmas ? (
        <Snowfall
            color={(colorMode === 'dark' ? '#e9fffc' : '#c9e8f1')}
            style={{
                opacity: (colorMode === 'dark' ? '22%' : '60%'), position: 'fixed',
                width: '100vw',
                height: '100vh',
            }}

            snowflakeCount={getRandomInt(280, 500)}
            images={[snowflake]}/>
    ) : (<></>)
}

export default SnowfallBackground;
