((
    net = require('net'),
    server = net.createServer((socket) => (
        socket.on('data', data=>(
            socket.write(`"HTTP/1.1 200 OK\r\n\r\n" ${data}`),
            socket.end()
        )),
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    ))
)=>(
    server.listen(4221, "localhost")
))()
