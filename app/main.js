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
        )=>socket.write(
            match(verb,{
                GET:responseBody(
                        match(path,{
                        '/':'',
                        [`/echo/${chunks.join('/')}`]:chunks.join('/'),
                        '/user-agent':Agent
                    }) ?? 404
                )
            })
        )),
        socket.on("close", () => (
            socket.close(
                socket.end()
            )
        ))
    ))
)=>
    server.listen(4221, "localhost")
)()
