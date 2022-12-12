import asyncio
import websockets
import numpy as np
from matplotlib import pyplot as plt
from scipy.fft import rfft, rfftfreq

SAMPLE_RATE = 44100  # Hertz
DURATION = 5  # Seconds

def ProcessFFT(PreFFTdata):
    normalized_tone = np.int16((PreFFTdata / PreFFTdata.max()) * 32767)

    N = PreFFTdata.size

    # Note the extra 'r' at the front
    yf = rfft(normalized_tone)
    xf = rfftfreq(N, 1 / SAMPLE_RATE)

    Yvalues = '{\n"Yvalues":['

    for i in range(len(yf)):
        Yvalues +=(str(int(np.abs(yf[i].imag))))
        if(i<len(yf)-1):
            Yvalues+=','
        Yvalues+='\n'
    Yvalues+=']}'

    Xvalues = '{\n"Xvalues":['

    for i in range(len(xf)):
        Xvalues +=(str(int(xf[i])))
        if(i<len(xf)-1):
            Xvalues+=','
        Xvalues+='\n'
    Xvalues+=']}'
    #print(Xvalues)
    return Yvalues,Xvalues

# create handler for each connection
 
async def handler(websocket, path):
    data = await websocket.recv()
    number = [int(i, 20) for i in data.split(',')]
    #print(f"Recieved: {number}")
    
    PreFFTdata = np.array(number)
    Yvalues,Xvalues =  ProcessFFT(PreFFTdata)
    
    await websocket.send(Xvalues)
    await websocket.send(Yvalues)
 
start_server = websockets.serve(handler, "localhost", 50007)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()