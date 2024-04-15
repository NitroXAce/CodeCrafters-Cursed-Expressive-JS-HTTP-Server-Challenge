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
                GET: responseBody(match(path,{
                    '/':200,
                    '/user-agent':Agent,
                    [`/echo/${chunks.join('/')}`]:chunks.join('/'),
                    [`/files/${chunks.join('/')}`]:(
                        nodePath = '',
                        dirArg = process.argv.findIndex(el => el === '--directory') + 1,
                        dirPath = dirArg && process.argv[dirArg],
                        fileName = chunks.join('/'),
                        filePath = dirArg && nodePath.join(dirPath, fileName)

                    )=> !dirArg ? 500 : 
                        fs.existsSync(filePath) &&
                        fs.readFileSync(filePath).toString('utf-8')
                })?? 404)
                
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
