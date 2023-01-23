const { io } = require("socket.io-client");

const socket = io("ws://localhost:50007");

socket.on("Mobile_Data", () => 
{
    console.log("Mobile_Data");
});

while(true)
{
    socket.emit("Mobile_Get");
}
