import 'rc-toastr/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ChakraProvider} from '@chakra-ui/react';
import {theme} from './utils/theme';
import {ToastProvider} from 'rc-toastr';
import moment from 'moment';

moment.locale('en');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ChakraProvider theme={theme}>
        <ToastProvider config={{
            position: 'bottom-right',
            duration: 7000,
            showProgressBar: true,
            zIndex: 1000,
            maxToasts: 5,
            autoClose: true,
            pauseOnHover: true
        }}>
            <App/>
        </ToastProvider>
    </ChakraProvider>
    ,
)
