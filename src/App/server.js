const WebSocketServer = require('ws').Server
const web_socket = new WebSocketServer({ port: 50007 })

var mobileFFT = '0'
var WebFFT = '0'

const No_device = 0
const Mobile_Device = 1
const Web_Device = 2


require('../fft.js').onRuntimeInitialized = _ => 
{
    const FFTCpp = require('../fft.js').cwrap('fft', 'string', ['string',])

    //const Adata = new AudioData(Mobile_Device)

    

    web_socket.on('connection', (ws) =>
    {
        ws.send('Connected');

        ws.addEventListener('message', function (message) 
        {
            try
            {
                const audioDataJson = JSON.parse(message.data)
                //console.log(audioDataJson.data)
                if(audioDataJson.type == 'getMobileFFT')
                {
                    ws.send(mobileFFT);
                }
                else if(audioDataJson.type == 'getWebFFT')
                {
                    ws.send(WebFFT);
                }
                else if(audioDataJson.type == 'UpdateWebFFT')
                {
                    const obj = FFTCpp(audioDataJson.data.toString(),44100)
                    WebFFT = obj
                
                }
                else if(audioDataJson.type == 'UpdateMobileFFT')
                {
                    const obj = FFTCpp(audioDataJson.data.toString(),44100)
                    mobileFFT = obj
                }
            }
            catch
            {
                console.log('error')
            }
            
        })
    })
    
    //let obj = test("2,1,0,-1,-2,-1,0,1")
};

