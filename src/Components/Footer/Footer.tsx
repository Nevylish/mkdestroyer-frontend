import './Footer.css';
import React, {useEffect, useState} from 'react';
import {Box, Center, Container, Divider, Spinner, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import moment from 'moment';
import {useToast} from "rc-toastr";
import {Constants} from "../../utils/constants";

export interface IFooterProps {
    isConnectedToWS: boolean;
}

enum eConnectionStatus {
    CONNECTING,
    CONNECTED,
    ERROR
}

const Footer = ({isConnectedToWS}: IFooterProps) => {
    const {toast} = useToast();
    const [connectionStatus, setConnectionStatus] = useState(eConnectionStatus.CONNECTING);
    const year = moment().year();
    const currentYear = year !== 2022 ? `2022-${year}` : '2022';

    useEffect(() => {
        if (isConnectedToWS) {
            setConnectionStatus(eConnectionStatus.CONNECTED);
        } else {
            const timer = setTimeout(() => {
                if (!isConnectedToWS) {
                    setConnectionStatus(eConnectionStatus.ERROR);
                    toast.error('Unable to connect to backend server: Try again later or wait a few minutes.');
                }
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [isConnectedToWS]);

    const WebSocketStatus = () => {
        if (connectionStatus === eConnectionStatus.CONNECTED) {
            return <Text className={'ApiStatusText'} style={{color: 'green'}}>Connected</Text>;
        } else {
            return (
                <>
                    <Text className={'ApiStatusText'} style={{color: connectionStatus === eConnectionStatus.ERROR ? 'darkorange' : 'white'}}>Connecting{connectionStatus === eConnectionStatus.ERROR ? '...' : ''}</Text>
                    <Spinner className={'ApiStatusSpinner'} size='xs'/>
                </>
            );
        }
    };

    {/* Sorry for <br/>, mais c'est pratique flemme de changer le css */
    }

    const EducationalOnlyText = () => {
        if (Constants.educationModeEnabled) {
            return <></>
        } else {
            return <>
                <Text className={'EducationOnlyText'}>
                    This website and its creation are only for educational purposes.<br/><br/>
                    Created to raise awareness among Discord server managers about malicious individuals, <br/>I
                    made this website to demonstrate how easy it is to deploy a destructive tool.
                    <br/><br/>
                    Thanks to this, server owners were able to recheck the security of their servers and will pay
                    more attention to whom they grant privileges.
                </Text>
                <Divider orientation='horizontal'/>
            </>
        }
    }

    return (
        <div className={'Footer'}>
            <Box
                bg={useColorModeValue('gray.50', 'gray.900')}
                color={useColorModeValue('gray.700', 'gray.200')}>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={4}>
                    <Center>Backend status ➜ <WebSocketStatus/></Center>
                </Container>
            </Box>
            <br/>
            <Box
                bg={useColorModeValue('gray.50', 'gray.900')}
                color={useColorModeValue('gray.700', 'gray.200')}>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={4}>
                    <EducationalOnlyText/>
                    <Text className={'CopyrightText'}>
                        {currentYear} Guilds Destroyer.
                        No rights reserved. -
                        Not affiliated with Discord Inc, discord.js or anyone else.
                    </Text>
                </Container>
            </Box>

        </div>
    )
}

export default Footer;
