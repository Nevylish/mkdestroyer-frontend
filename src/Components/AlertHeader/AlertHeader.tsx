import './AlertHeader.css';
import React from 'react';
import {Alert, AlertDescription, AlertIcon, AlertTitle} from '@chakra-ui/react';
import {Functions} from '../../utils/functions';
import capitalizeFirstLetter = Functions.capitalizeFirstLetter;

export interface IAlertHeader {
    status: 'success' | 'warning' | 'error' | 'loading';
    display: boolean;
    text: string;
}

const AlertHeader = (props: IAlertHeader) => {
    return props.display ? (
        <Alert status={props.status}>
            <AlertIcon/>
            <AlertTitle>{capitalizeFirstLetter(props.status)}:</AlertTitle>
            <AlertDescription>{props.text}</AlertDescription>
        </Alert>
    ) : (<></>)
}

export default AlertHeader;
