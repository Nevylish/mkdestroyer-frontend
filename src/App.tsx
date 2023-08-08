import './App.css';
import React, {useReducer} from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    SimpleGrid,
    Stack,
    Switch
} from '@chakra-ui/react';
import WebSocket, {useWebSocket} from './utils/websocket';
import {Functions} from './utils/functions';
import AlertHeader from './Components/AlertHeader/AlertHeader';
import Footer from './Components/Footer/Footer';
import SnowfallBackground from './Components/SnowfallBackground/SnowfallBackground';
import utf8_to_b64 = Functions.utf8_to_b64;

export const $ws = new WebSocket().socket;

interface State {
    inputToken: string;
    inputNewChannelsName: string;
    inputTextToSpam: string;
    inputGuildId: string;
    switchBanEveryone: boolean;
    switchKickEveryone: boolean;
    switchCreateMassRoles: boolean;
    switchDeleteChannels: boolean;
    switchSpamChannels: boolean;
}

interface Action {
    type: string;
    property: string;
    value: string | boolean;
}

const initialState: State = {
    inputToken: '',
    inputNewChannelsName: '',
    inputTextToSpam: '',
    inputGuildId: '',
    switchBanEveryone: false,
    switchKickEveryone: false,
    switchCreateMassRoles: false,
    switchDeleteChannels: false,
    switchSpamChannels: false
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_PROPERTY':
            return {
                ...state,
                [action.property]: action.value
            };
        default:
            throw new Error();
    }
}

const App = () => {
    const {alert, isConnectedToWS, isLoading, setLoading} = useWebSocket($ws);
    const [properties, dispatch] = useReducer(reducer, initialState);
    const [showToken, handleShowTokenButton] = React.useState(false);

    const hasEmptyRequiredInput = !(
        /* Token*/ properties.inputToken &&
        /*Create mass channels and spam inside*/ (properties.switchSpamChannels ? properties.inputNewChannelsName && properties.switchSpamChannels && properties.inputTextToSpam : true)
    );
    const noOptionsSelected = !(properties.switchBanEveryone || properties.switchKickEveryone || properties.switchSpamChannels || properties.switchDeleteChannels || properties.switchCreateMassRoles);

    const handleInputChange = (property: string, isSwitch: boolean = false) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = isSwitch ? event.target.checked : event.target.value;
        dispatch({type: 'SET_PROPERTY', property, value});
    };

    const handleSubmitClick = () => {
        setLoading.on();
        $ws.emit('perform_attack', utf8_to_b64(JSON.stringify(properties)));
    }

    return (
        <>
            {/* Snowfall Background for Christmas */}
            <SnowfallBackground/>

            {/* @ts-ignore */}
            <AlertHeader status={alert.status} display={alert.display} text={alert.text}/>

            <div className={'App'}>
                <Heading as={'h1'} className={'Header'}>Mordekaiser's guilds
                    destroyer</Heading>

                {/* Bot information & attack options inputs */}
                <h2 className={'BotInfoText'}>Bot's informations:</h2>
                <Stack className={'BotInfoInputStack'} direction={'column'} spacing={3}>

                    <InputGroup>
                        <Input onChange={handleInputChange('inputToken')}
                               isInvalid={!properties.inputToken}
                               isRequired={true} size={'lg'}
                               type={showToken ? 'text' : 'password'}
                               placeholder={'Enter the bot\'s token'}/>
                        <InputRightElement style={{display: !properties.inputToken ? 'none' : ''}} width={'5rem'}
                                           paddingTop={'8px'}>
                            <Button h={'1.75rem'} size={'sm'} onClick={() => handleShowTokenButton(!showToken)}>
                                {showToken ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>

                    <Input onChange={handleInputChange('inputNewChannelsName')}
                           isInvalid={!properties.inputNewChannelsName && properties.switchSpamChannels}
                           style={{display: !properties.switchSpamChannels ? 'none' : ''}} isRequired={true}
                           size={'lg'}
                           placeholder='Name of the new channels'/>
                    <Input onChange={handleInputChange('inputTextToSpam')}
                           isInvalid={!properties.inputTextToSpam && properties.switchSpamChannels}
                           style={{display: !properties.switchSpamChannels ? 'none' : ''}} isRequired={true} size={'lg'}
                           placeholder='Text of the message to spam'/>
                    <Input onChange={handleInputChange('inputGuildId')} isRequired={false}
                           size={'lg'}
                           placeholder='Server ID (All servers will be attacked if empty)'/>

                </Stack>

                {/* Attack options switchs */}
                <h1 className={'OptionsFormText'}>Options:</h1>
                <FormControl className={'OptionsForm'} as={SimpleGrid} columns={{base: 2, lg: 4}}>
                    <FormLabel htmlFor='switchBanMembers'>Ban everyone</FormLabel>
                    <Switch id='switchBanMembers' onChange={handleInputChange('switchBanEveryone', true)}/>

                    <FormLabel htmlFor='switchKickMembers'>Kick everyone</FormLabel>
                    <Switch id='switchKickMembers' onChange={handleInputChange('switchKickEveryone', true)}/>

                    <FormLabel htmlFor='switchSpamChannels'>Create mass channels and spam inside</FormLabel>
                    <Switch id='switchSpamChannels' onChange={handleInputChange('switchSpamChannels', true)}/>

                    <FormLabel htmlFor='switchDeleteChannels'>Delete all channels</FormLabel>
                    <Switch id='switchDeleteChannels' onChange={handleInputChange('switchDeleteChannels', true)}/>

                    <FormLabel htmlFor='switchCreateMassRoles'>Create mass roles</FormLabel>
                    <Switch id='switchCreateMassRoles' onChange={handleInputChange('switchCreateMassRoles', true)}/>

                    <FormLabel htmlFor='switchDeleteRoles'>Delete all roles</FormLabel>
                    <Switch id='switchDeleteRoles' isDisabled/>
                </FormControl>

                {/* Attack button */}
                <Stack>
                    <Button
                        colorScheme={(hasEmptyRequiredInput || noOptionsSelected || !isConnectedToWS) ? 'red' : 'green'}
                        isDisabled={hasEmptyRequiredInput || noOptionsSelected || !isConnectedToWS} size={'lg'}
                        isLoading={isLoading} loadingText={'Performing attack...'}
                        onClick={handleSubmitClick}> {hasEmptyRequiredInput ? 'Fill in all required fields' : noOptionsSelected ? 'You must select at least one option' : isConnectedToWS ? 'Attack' : 'Attempting to connect to the WebSocket backend...'}</Button>
                </Stack>

            </div>
            <Footer isConnectedToWS={isConnectedToWS}/>
        </>
    )
}

export default App;
