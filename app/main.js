((
    net = require('net'),
    {match, stringToObj} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            message = data.toString().split("\r\n"),
            path = message[0].split(' ')[1]
        )=>(
            console.log(data.toString(),`\nPath: '${path}'`),(
                stringToObj(message[0],{
                    GET:{
                        [path?.[1] ?? '/']:{
                            'HTTP/1.1':true
                        }
                    }
                }) &&
                stringToObj(message[1],{
                    'Host:':{
                        'localhost:4221':true
                    }
                }) &&
                stringToObj(message[2],{
                    'User-Agent:':{
                        'Go-http-client/1.1':()=>(
                            socket.end(
                                socket.write(`${[
                                    'HTTP/1.1 200 OK',
                                    'Content-Type: text/plain',
                                    'Content-Length: 3',
                                    '',
                                    'abc'
                                ].join('\r\n')}`)
                            )
                        )
                    }
                })
            ) ?? socket.end()
            /*path === "/"
            ? socket.write("HTTP/1.1 200 OK\r\n\r\n")
            : socket.write("HTTP/1.1 404 Not Found\r\n\r\n"),*/
            //socket.end()
        )),
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    ))
)=>(
    server.listen(4221, "localhost")
))()
