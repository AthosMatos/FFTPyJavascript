const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:50007');

const msgTypes = 
{
    fft_update: 'dataUpdate',
    getData: 'getData',
    txt_response: ' txt_response',
    fft_response: 'fft_response',
}
const deviceTypes =
{
    mobile: 'mobile',
    web: 'web',
}

socket.onopen = (event) => 
{
    const dataTest = JSON.stringify({msgType: msgTypes.fft_update, data: '0,1,0,1,0,1,0,1',device: 'mobile'})
    socket.send(dataTest)
};


socket.onmessage = (event) => 
{
    try
    {  
        const audioData = JSON.parse(event.data)
        switch(audioData.type)
        {
            case 'mobileFFT':
                console.log('mobileFFT :',audioData.data)
                break;
            case 'webFFT':
                console.log('webFFT :',audioData.data)
                break;
            case 'Your connection is established':
                console.log('Your connection is established')
                break;
        }
    }
    catch
    {
        console.log("error: ",event.data)
    }
};

socket.onclose = (event) => 
{
    console.log("Connection closed");
}


