((
    net = require('net'),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            message = data.toString().split("\r\n"),
            path = message[0].split(' ')[1]
        )=>(
            console.log(data,`\nPath: '${path}'`),
            path === "/"
            ? socket.write("HTTP/1.1 200 OK\r\n\r\n")
            : socket.write("HTTP/1.1 404 Not Found\r\n\r\n"),
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
