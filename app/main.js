((
    net = require('net'),
    {match, stringToObj} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            message = data.toString().split("\r\n"),
            path = message[0].split(' ')[1],
            [begin,...chunks] = path.split('/')
        )=>socket.end(
            socket.write(match(path,{
                '/':'HTTP/1.1 200 OK\r\n\r\n',
                [`/echo/${chunks.join('/')}`]:[
                    'HTTP/1.1 200 OK',
                    `Content-Type: text/plain`,
                    `Content-length: ${chunks.join('/').length}`,
                    '',
                    '',
                    chunks.join(' ')

                ].join('\r\n')
            })??"HTTP/1.1 404 Not Found\r\n\r\n")
        )),
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    ))
)=>(
    server.listen(4221, "localhost")
))()
