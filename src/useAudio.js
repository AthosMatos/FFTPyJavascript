export let analyser
export let bufferLength = 0
export let dataArray = new Uint8Array(0)
export let ready = false

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => 
{
    const micStream = stream
    //console.log(micStream)
    const audioContextOptions =
    {
        sampleRate: 41000,
    };
    const audioCtx = new window.AudioContext(audioContextOptions)
    const source = audioCtx.createMediaStreamSource(micStream)

    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8
    
    //analyser.getByteFrequencyData
    source.connect(analyser)
    bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    ready = true
})




