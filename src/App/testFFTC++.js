const fftJS = require('./fft.js')

fftJS.onRuntimeInitialized = _ => 
{
    const testData = ''

    const FFTCpp = fftJS.cwrap('fft', 'string', ['string',])
    const obj = FFTCpp(testData,44100)
    require("fs").writeFile("demo.txt", `${obj}`,(err)=>{console.log(err)});
    //console.log(JSON.parse(obj).data)
    //let obj = test("2,1,0,-1,-2,-1,0,1")
};

