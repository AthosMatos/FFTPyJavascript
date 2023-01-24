import { useState, useEffect } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

export const msgTypes = 
{
    mobileDataUpdate: 'dataUpdate',
    getData: 'getData',
    txt_response: ' txt_response',
    audioData_Response: 'audioData_response',
}
export const deviceTypes =
{
    mobile: 'mobile',
    web: 'web',
}

const useMyWebSocket = (adress) => 
{
    const { sendMessage, getWebSocket,readyState:WebSocketReady } = useWebSocket(`ws://${adress}`, {
        onError: (event) => { console.error(event); },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });
    const [ready,setReady] = useState(false)
    
    useEffect(() => 
    {
       if(WebSocketReady == 1)
       {
            console.log('WebSocket ready');
            setReady(true)
       }
    }, [WebSocketReady]);

    function onMobileAudioDataMessage(callback)
    {
        if(ready)
        {
            try
            {
                getWebSocket().onmessage = (event) =>
                {
                    const lastJsonMessage = JSON.parse(event.data)
                    if (lastJsonMessage.msgType == msgTypes.audioData_Response && lastJsonMessage.device == deviceTypes.mobile)
                    {
                        callback(lastJsonMessage.data)
                    }
                
                }
            }
            catch(e)
            {
                console.log(e)
            }
        }
        else console.log('WebSocket not ready');
    }

    function getMobileAudioData()
    {
        if(ready) 
        {
            try
            {
                sendMessage(`{ "msgType": "${msgTypes.getData}", "device": "${deviceTypes.mobile}" }`);
            }
            catch(e)
            {
                console.log(e)
            }
        }
        else console.log('WebSocket not ready');
    }
    
    return { ready:ready, onMobileAudioDataMessage, getMobileAudioData };
};

export default useMyWebSocket;