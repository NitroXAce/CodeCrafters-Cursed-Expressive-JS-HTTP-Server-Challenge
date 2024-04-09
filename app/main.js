((
    net = require('net'),
    server = net.createServer((socket) => 
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    )
)=>(
    server.listen(4221, "localhost")
))()
