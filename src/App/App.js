import React, { useEffect, useRef, useState } from "react"
import useWebSocket from 'react-use-websocket';
import useCanvas from "../useCanvas";
import {analyser,bufferLength,dataArray, useAudio} from "../useAudio";
import useMyWebSocket from "../useMyWebSocket";

const App = () => 
{
    const { getMobileAudioData,onMobileAudioDataMessage,ready: WebSocketReady } = useMyWebSocket('localhost:50007')
    const {ready:AudioReady} = useAudio()
    const WebcanvasRef = useRef()
    const MobileCanvasRef = useRef()
    const {canvas:MobileCanvas,ready:MobileCanvasReady,canvasCtx:MobileCanvasCtx} = useCanvas(MobileCanvasRef)
    const {canvas:WebCanvas,ready:WebCanvasReady,canvasCtx:WebCanvasCtx} = useCanvas(WebcanvasRef)
    
    useEffect(() => 
    {
        function prepareCanvas()
        {
            WebCanvas.width = window.innerWidth * 0.8
            WebCanvas.height = 200
            MobileCanvas.width = window.innerWidth * 0.8
            MobileCanvas.height = 200
            WebCanvasCtx.lineWidth = 2;
            MobileCanvasCtx.lineWidth = 2;
            WebCanvasCtx.strokeStyle = "rgb(255, 0, 0)";
            MobileCanvasCtx.strokeStyle = "rgb(255, 0, 0)";
        }

        if (WebCanvasReady && MobileCanvasReady && WebSocketReady && AudioReady)
        {
            prepareCanvas()
            drawOsciloscopes()
        }
    }, [AudioReady,WebCanvasReady,MobileCanvasReady,WebSocketReady])

    function drawOsciloscopes()
    {
        requestAnimationFrame(drawOsciloscopes)
        getMobileAudioData()
        
        onMobileAudioDataMessage((lastJsonMessage)=>
        {
            analyser.getByteTimeDomainData(dataArray);
            
            function DrawMobileOsciloscope(dArray)
            {
                MobileCanvasCtx.clearRect(0, 0, MobileCanvas.width, MobileCanvas.height);
                MobileCanvasCtx.beginPath();

                const barWidth = (MobileCanvas.width / dArray.length) 
                for (let i = 0,x = 0; i < dArray.length; i++) 
                {
                    const v = dArray[i] / 128.0;
                    const y = (v * MobileCanvas.height) / 2;
                
                    if (i === 0) 
                    {
                        MobileCanvasCtx.moveTo(x, y);
                    } 
                    else 
                    {
                        MobileCanvasCtx.lineTo(x, y);
                    }
                    x += barWidth;
                }
                MobileCanvasCtx.lineTo(MobileCanvas.width, MobileCanvas.height / 2);
                MobileCanvasCtx.stroke();
            }
            function DrawWebOsciloscope()
            {
                WebCanvasCtx.clearRect(0, 0, WebCanvas.width, WebCanvas.height);
                WebCanvasCtx.beginPath();

                const barWidth = (WebCanvas.width / bufferLength) 
                for (let i = 0,x = 0; i < bufferLength; i++) 
                {
                    const v = dataArray[i] / 128.0;
                    const y = (v * WebCanvas.height) / 2;
                
                    if (i === 0) 
                    {
                        WebCanvasCtx.moveTo(x, y);
                    } 
                    else 
                    {
                        WebCanvasCtx.lineTo(x, y);
                    }
                
                    x += barWidth;
                }
                WebCanvasCtx.lineTo(WebCanvas.width, WebCanvas.height / 2);
                WebCanvasCtx.stroke();
            }

            DrawMobileOsciloscope(lastJsonMessage)
            DrawWebOsciloscope()
        })
        
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',flexDirection:'column' }}>
            <div>
                <p style={{fontWeight:'bolder',fontSize:'40px',margin:0}}>Mobile Audio</p>
                <canvas
                    style={{ border: 'solid 2px black' }}
                    ref={MobileCanvasRef}
                />
            </div>
            <div>
                <p style={{fontWeight:'bolder',fontSize:'40px',margin:0}}>Web Audio</p>
                <canvas
                    style={{ border: 'solid 2px black' }}
                    ref={WebcanvasRef}
                />
            </div>
        </div>

    )
}

export default App

