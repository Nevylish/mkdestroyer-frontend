import {extendTheme} from '@chakra-ui/react';

export const theme = extendTheme({
    styles: {
        global: {
            body: {
                transitionProperty: 'all',
                transitionDuration: 'normal',
            },
        },
    },
    config: {
        disableTransitionOnChange: false,
        initialColorMode: 'dark',
        useSystemColorMode: false
    }
});
