import asyncio
import websockets
import numpy as np
from matplotlib import pyplot as plt
from scipy.fft import rfft, rfftfreq,fft,fftfreq
import time

SAMPLE_RATE = 32000 

def ProcessFFT(PreFFTdata):
    normalized_tone = np.int16((PreFFTdata / PreFFTdata.max()) * 32767)

    N = PreFFTdata.size

    # Note the extra 'r' at the front
    yf = rfft(normalized_tone)
    xf = rfftfreq(N, 1 / SAMPLE_RATE)

    Values = '{\n"Yvalues":['

    for i in range(len(yf)):
        Values +=(str(int(np.abs(yf[i].imag))))
        if(i<len(yf)-1):
            Values+=','
        Values+='\n'
    Values+='],\n"Xvalues":['

    for i in range(len(xf)):
        Values +=(str(int(xf[i])))
        if(i<len(xf)-1):
            Values+=','
        Values+='\n'
    Values+=']}'
    #print(Xvalues)
    return Values

# create handler for each connection
 
async def handler(websocket, path):
    while True:
        data = await websocket.recv()
        
        if data == 'Done':
            break
        start_time = time.time()
    
        number = [float(i) for i in data.split(',')]
        #print(f"Recieved: {number}")
        
        PreFFTdata = np.array(number)
        values =  ProcessFFT(PreFFTdata)
        
        #print("--- %s seconds ---" % (time.time() - start_time))
        
        await websocket.send(values)
        await websocket.send('Done')
 
start_server = websockets.serve(handler, "localhost", 50007)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()