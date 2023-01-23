import React, { useEffect, useRef, useState } from "react"
import useWebSocket from 'react-use-websocket';
import useCanvas from "../useCanvas";
import {analyser,bufferLength,dataArray,ready as AudioReady} from "../useAudio";

export const msgTypes = 
{
    fft_update: 'dataUpdate',
    getData: 'getData',
    txt_response: ' txt_response',
    fft_response: 'fft_response',
}
export const deviceTypes =
{
    mobile: 'mobile',
    web: 'web',
}

const App = () => 
{
    const { sendMessage, getWebSocket,readyState:WebSocketReady,lastJsonMessage } = useWebSocket('ws://localhost:50007', {
        onOpen: () => {
            console.log('opened');
        },
        onError: (event) => { console.error(event); },
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 3000
    });
    const WebcanvasRef = useRef()
    const MobileCanvasRef = useRef()
    const {canvas:MobileCanvas,ready:MobileCanvasReady,canvasCtx:MobileCanvasCtx} = useCanvas(MobileCanvasRef)
    const {canvas:WebCanvas,ready:WebCanvasReady,canvasCtx:WebCanvasCtx} = useCanvas(WebcanvasRef)
    
    useEffect(() => 
    {
        //if (WebCanvasReady && MobileCanvasReady && WebSocketReady === 1 && AudioReady) 
        if (WebCanvasReady && MobileCanvasReady && AudioReady) 
        {
            WebCanvas.width = window.innerWidth * 0.8
            WebCanvas.height = 200
            MobileCanvas.width = window.innerWidth * 0.8
            MobileCanvas.height = 200

            drawcanvas()
        }
        
    }, [AudioReady,WebCanvasReady,MobileCanvasReady,WebSocketReady])


    function drawcanvas() 
    {
        requestAnimationFrame(drawcanvas)
        sendMessage(`{ "msgType": "${msgTypes.getData}", "device": "${deviceTypes.mobile}" }`);
        let max1 = 0
        let max2 = 0
        
        try
        {
            if (lastJsonMessage.msgType == msgTypes.fft_response) 
            {
                const Yv = Float32Array.from(lastJsonMessage.data)

                for(let i = 1; i < Yv.length; i++)
                {
                    if(Yv[i] > max1) max1 = Yv[i]
                }
                for(let i = 0; i < dataArray.length; i++)
                {
                    if(dataArray[i] > max2) max2 = dataArray[i]
                }
                //console.log(max1)

                //draw(Yv)
            }
            //else console.log(event.data); 
        }
        catch
        {
            //console.log('error')
        }
        
        function draw(Yrray) 
        {
            analyser.getByteTimeDomainData(dataArray);
            WebCanvasCtx.lineWidth = 2;
            WebCanvasCtx.strokeStyle = "rgb(255, 0, 0)";
            WebCanvasCtx.clearRect(0, 0, WebCanvas.width, WebCanvas.height);
            WebCanvasCtx.font = '10px serif';

            MobileCanvasCtx.lineWidth = 2;
            MobileCanvasCtx.strokeStyle = "rgb(255, 0, 0)";
            MobileCanvasCtx.clearRect(0, 0, MobileCanvas.width, MobileCanvas.height);
            MobileCanvasCtx.font = '10px serif';

            let barWidth = (WebCanvas.width / Yrray.length) 

            let x = 0;
            let barHeight;

            for (let i = 0; i < Yrray.length; i++) 
            {
                barHeight = (((100*Yrray[i])/max1)*(WebCanvas.height))/100;
                WebCanvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                WebCanvasCtx.fillRect(x, WebCanvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
            x = 0;
            barWidth = (WebCanvas.width / bufferLength) 

            for (let i = 0; i < bufferLength; i++) 
            {
                barHeight = dataArray[i];
                MobileCanvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                MobileCanvasCtx.fillRect(x, MobileCanvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }


        }

        draw([0])
    }


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',flexDirection:'column' }}>
            <div>
                <p style={{fontWeight:'bolder',fontSize:'40px',margin:0}}>Mobile FFT</p>
                <canvas
                    style={{ border: 'solid 2px black' }}
                    ref={WebcanvasRef}
                />
            </div>
            <div>
                <p style={{fontWeight:'bolder',fontSize:'40px',margin:0}}>Web FFT</p>
                <canvas
                    style={{ border: 'solid 2px black' }}
                    ref={MobileCanvasRef}
                />
            </div>
        </div>

    )
}

export default App

