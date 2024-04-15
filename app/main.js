((
    {fs,path,net, match, stringToObj, responseBody} = require('./dependencies'),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            [ command, host, agent, encoding] = data.toString().split("\r\n"),
            [verb,path,httpType]=command.split(' '),
            [Host,address]=host.split(' '),
            [userAgent, Agent]=agent.split(' '),
            [begin,yeet,...chunks] = path.split('/'),
        )=>socket.write(
            match(verb,{
                GET:(
                    bool = match(path,{
                        '/':'open',
                        [`/echo/${chunks.join('/')}`]:chunks.join('/'),
                        '/user-agent':Agent
                    })
                )=> bool
                    ? responseBody(bool)
                    : "HTTP/1.1 404 Not Found\r\n\r\n"
                
            })
        )),
        socket.on("close", () =>
            socket.close(
                socket.end()
            )
        )
    ))
)=>
    server.listen(4221, "localhost")
)()
