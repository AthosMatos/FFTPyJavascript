import axios from "axios";
import React, { useEffect, useRef, useState } from "react"



const App = () =>
{
    const canvasRef = useRef()
    const inputBufferSize = 2048;
    const sampleRate = 48000
    const smoothingTimeConstant = 0.8
    const minDecibels = -100

    let canvas
    let canvasCtx 
    let dataArray
    let bufferLength
    let analyser

    useEffect(()=>
    {
        if(canvasRef.current)
        {
            canvas = canvasRef.current
            canvasCtx = canvas.getContext("2d",{willReadFrequently: true})

            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => 
            {
                const micStream = stream
                const audioContextOptions = 
                {
                    sampleRate:sampleRate //can see up to 4000hz, 31,25 hz each step
                };
                const audioCtx = new window.AudioContext(audioContextOptions)
                
                analyser = audioCtx.createAnalyser()

                const source = audioCtx.createMediaStreamSource(micStream)
                source.connect(analyser)

                analyser.fftSize = inputBufferSize
                analyser.smoothingTimeConstant = smoothingTimeConstant
                analyser.minDecibels = minDecibels
                
                bufferLength = analyser.frequencyBinCount
                dataArray = new Uint8Array(bufferLength)
          
                drawcanvas()
            })
            
        }

      
    },[canvasRef.current])


    function drawcanvas()
    {
        //console.log(dataArray)
        requestAnimationFrame(drawcanvas)

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(255, 0, 0)";
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.font = '10px serif';

        const barWidth = (canvas.width  / bufferLength) * 2.5
        const buffInterval = bufferLength/10

        let x = 0;
        let x2 = 0;
        let barHeight;
        let hzS = 0
        let currInterval = 0
        
        for (let i = 0; i < bufferLength; i++) 
        {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight - 20, barWidth, barHeight);
            
            if(i >= currInterval || i == 0)
            {
                if(i != 0)currInterval+=buffInterval
                canvasCtx.fillText(parseInt(hzS), x2, canvas.height);
                //console.log(parseInt(hzS),x2)
                x2 += 60;
            }

            x += barWidth + 1;
            hzS+=(sampleRate/(inputBufferSize/2))
        }
    }
    

    return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
            <canvas
            width={800}
            height={300}
            style={{border:'solid 2px black'}}
            ref = {canvasRef}
            />
            <button onClick={()=>
                {
                    /*
                         let arr = []
                        for (let i = 0; i < dataArray.length; i++)
                        {
                            arr.push(dataArray[i])
                        }
                        console.log(arr.length)

                    */
                    const api = axios.create({baseURL:'http://192.168.0.10:5000'})
                    api.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
                    api.get('/').then((res)=>
                    {
                        console.log(res.data)
                    })

                }}>adasddas</button>
        </div>
        
    )
}

export default App

