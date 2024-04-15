((
    net = require('net'),
    {match, stringToObj,responseBody} = require('./modules')(),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            [ command, host, agent, encoding] = data.toString().split("\r\n"),
            [verb,path,httpType]=command.split(' '),
            [Host,address]=host.split(' '),
            [userAgent, Agent]=agent.split(' '),
            [begin,yeet,...chunks] = path.split('/'),
        )=>socket.end(socket.write(
            match(verb,{
                GET:()=> match(path,{
                    '/':'HTTP/1.1 200 OK\r\n\r\n',
                    [`/echo/${chunks.join('/')}`]:responseBody(chunks.join('/')),
                    '/user-agent':responseBody(Agent)
                })
            }) ?? "HTTP/1.1 404 Not Found\r\n\r\n")
        )),
        socket.on("close", () => (
            socket.end(),
            server.close()
        ))
    ))
)=>
    server.listen(4221, "localhost")
)()
