((
    net = require('net'),
    {match, stringToObj} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            message = data.toString().split("\r\n"),
            path = message[0].split(' ')[1],
            [begin,yeet,...chunks] = path.split('/')
        )=>(
            socket.write(
                match(path,{
                    '/':'HTTP/1.1 200 OK\r\n\r\n',
                    [`/echo/${chunks.join('/')}`]:[
                        'HTTP/1.1 200 OK\r\n',
                        `Content-Type: text/plain\r\n`,
                        `Content-length: ${chunks.join('/').length -1}\r\n`,
                        '',
                        '',
                        chunks.join('/')
                    ].join('')
                })??
                "HTTP/1.1 404 Not Found\r\n\r\n"
            ),
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
