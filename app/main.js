((
    net = require('net'),
    {match, stringToObj} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            [command,host,agent,encoding] = data.toString().split("\r\n"),
            path = command.split(' ')[1],
            [begin,yeet,...chunks] = path.split('/'),
            [
                [verb,path],
                [begin,yeet,...chunks] = path.split('/')
            ] = message
        )=>socket.end((
            socket.write(
                match(path,{
                    '/':'HTTP/1.1 200 OK\r\n\r\n',
                    [`/echo/${chunks.join('/')}`]:[
                        'HTTP/1.1 200 OK\r\n',
                        `Content-Type: text/plain\r\n`,
                        `Content-length: ${chunks.join('/').length}\r\n`,
                        '\r\n',
                        chunks.join('/')
                    ].join('')
                })??
                "HTTP/1.1 404 Not Found\r\n\r\n"
            )
        ))),
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    ))
)=>(
    server.listen(4221, "localhost")
))()
