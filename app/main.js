((
    net = require('net'),
    {match, stringToObj} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            message = data.toString().split("\r\n"),
            path = message[0].split(' ')[1],
            [begin,...chunks] = path.split('/').filter(key=>key ?? '\n')
        )=>socket.end((
            console.log(
                data.toString(),
                `\nPath: '${path}'`,
                `subPaths: [${chunks.join('\n')}\n]`
            ),(
            socket.write(match(path,{
                '/':'HTTP/1.1 200 OK\r\n\r\n',
                [`/echo/${chunks.join('/')}`]:[
                    `Content-Type: text/plain`,
                    `Content-length: ${chunks.join('/').length}`,
                    '',
                    '',
                    chunks.join(' ')

                ].join('\r\n')
            })??"HTTP/1.1 404 Not Found\r\n\r\n")
            /*stringToObj(message,{
                ['GET ' + (path ?? '/') + ' HTTP/1.1']:{
                    'Host: localhost:4221':{
                        'User-Agent: Go-http-client/1.1':()=>
                            socket.write(`${[
                                'HTTP/1.1 200 OK',
                                'Content-Type: text/plain',
                                'Content-Length: 3',
                                '\r\n',
                                'abc'
                            ].join('\r\n')}`)
                    }
                }
            }) ?? socket.write("HTTP/1.1 404 Not Found\r\n\r\n")*/
        )
            /*path === "/"
            ? socket.write("HTTP/1.1 200 OK\r\n\r\n")
            : socket.write("HTTP/1.1 404 Not Found\r\n\r\n"),*/
            //socket.end()
        ))),
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    ))
)=>(
    server.listen(4221, "localhost")
))()
