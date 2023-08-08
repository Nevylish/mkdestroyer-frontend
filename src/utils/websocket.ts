import io from 'socket.io-client';
import {useEffect, useState} from "react";
import {useBoolean} from "@chakra-ui/react";
import {useToast} from "rc-toastr";
import {Constants} from "./constants";

export default class WebSocket {
    public socket: any = null;
    private SOCKET_URI: string = import.meta.env.VITE_WS_URI;

    constructor() {
        this.socket = io(Constants.educationModeEnabled ? this.SOCKET_URI : "EDUCATION MODE DISABLED");
    }
}

export interface IAlert {
    status: string;
    display: boolean;
    text: string;
}

export const useWebSocket = (socket: any) => {
    const {toast} = useToast();
    const [alert, setAlert] = useState<IAlert>({
        status: 'warning',
        display: true,
        text: Constants.alertHeaderDefaultText
    });
    const [isLoading, setLoading] = useBoolean(false);
    const [isConnectedToWS, setConnectedToWS] = useState<boolean>(false);
    const [isWSErrored, setWSErrored] = useState<boolean>(false);

    const hideAlert = (time: number = 8000) => {
        setTimeout(() => setAlert({
            status: 'warning',
            display: true,
            text: Constants.alertHeaderDefaultText
        }), time);
    }

    useEffect(() => {
        socket.on('connect', () => {
            if (isWSErrored) {
                setLoading.off();
                toast.success('Connection to the Backend WebSocket has been restored');
                setAlert({
                    status: 'success',
                    display: true,
                    text: 'Connection to the Backend WebSocket has been restored'
                });
                hideAlert(7000);
            }

            setConnectedToWS(true);
        });

        socket.on('notification', (props: any) => {
            if (!props.message) return;
            const msg = props.message.toString();
            switch (props.type) {
                case 'success': {
                    toast.success(msg);
                    break;
                }
                case 'info': {
                    toast.info(msg);
                    break;
                }
                case 'error': {
                    toast.error(msg);
                    break;
                }
                case 'warning': {
                    toast.warning(msg);
                    break;
                }
                default: {
                    toast.default(msg);
                    break;
                }
            }
        });

        socket.on('update_status', (props: any) => {
            setAlert({status: props.status, display: props.display, text: props.text});
            if (props?.timeout) hideAlert(props.timeout);
        });

        socket.on('disconnect', () => {
            setWSErrored(true);
            setConnectedToWS(false);
            toast.error('Connection to the Backend WebSocket has been lost');
            setAlert({status: 'error', display: true, text: 'Connection to the WebSocket has been lost'});
        });

        socket.on('attack_performed', (props: any) => {
            toast.success(props.message)
            setLoading.off();
        });

        socket.on('attack_error', (props: any) => {
            toast.error(props.message);
            setLoading.off();
        });

        return () => {
            // Clean up the side effect
            socket.off('connect');
            socket.off('notification');
            socket.off('update_status');
            socket.off('disconnect');
            socket.off('attack_performed');
            socket.off('attack_error');
        }
    }, []);

    return {alert, isConnectedToWS, setAlert, isLoading, setLoading, toast};
};