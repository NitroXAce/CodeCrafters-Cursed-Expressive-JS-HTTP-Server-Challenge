((
    net = require('net'),
    {match, stringToObj} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            message = data.toString().split("\r\n"),
            path = message[0].split(' ')[1]
        )=>socket.end((
            console.log(data.toString(),`\nPath: '${path}'`),(
            socket.write(match(path,{
                default:"HTTP/1.1 404 Not Found\r\n\r\n",
                path:[
                    'HTTP/1.1 200 OK',
                    'Content-Type: text/plain',
                    'Content-Length: 3',
                    '',
                    'abc'
                ].join('\r\n'),

            }))
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
