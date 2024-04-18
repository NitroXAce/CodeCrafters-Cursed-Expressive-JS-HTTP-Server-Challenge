((
    {fs,nodePath,net, match, stringToObj, responseBody} = require('./dependencies'),
    server = net.createServer(socket => (
        socket.on('data', (
            data,
            [ command, host, agent, encoding] = data.toString().split("\r\n"),
            [verb,path,httpType]=command.split(' '),
            [Host,address]=host.split(' '),
            [userAgent, Agent]=agent.split(' '),
            [,commandName,...chunks] = path.split('/'),
        )=>socket.write(responseBody(
            match(commandName,{
                'files' : 'application/octet-stream'
            }) ?? 'text/plain',
            match(verb,{
                GET: match(path,{
                    '/':200,
                    '/user-agent':Agent,
                    [`/echo/${chunks.join('/')}`]:chunks.join('/'),
                    [`/files/${chunks.join('')}`]:(
                        dirArg = process.argv.findIndex(el => el === '--directory') + 1,
                        dirPath = dirArg && process.argv[dirArg],
                        fileName = chunks.join('')
                    )=> fs.readdirSync(dirPath).indexOf(fileName) + 1 && fs.readFileSync(nodePath.join(dirPath,fileName)).toString('utf-8')
                })
            }) ||  404
        ))),
        socket.on("close", () =>
            socket.close(
                socket.end()
            )
        )
    ))
)=>
    server.listen(4221, "localhost")
)()
