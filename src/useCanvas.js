import { useState, useEffect } from "react";

const useCanvas = (canvasRef) => 
{
    const [canvas,setCanvas] = useState()
    const [canvasCtx,setCanvasCtx] = useState()
    const [ready,setReady] = useState(false)
    
    useEffect(() => 
    {
        if(canvasRef.current) setCanvas(canvasRef.current)
    }, [canvasRef.current]);

    useEffect(() =>
    {
        if(canvas) setCanvasCtx(canvas.getContext('2d',{willReadFrequently: true}))
    },[canvas])

    useEffect(() =>
    {
        if(canvasCtx) setReady(true)
    },[canvasCtx])

    return { canvas:canvas, canvasCtx:canvasCtx, ready:ready };
};

export default useCanvas;