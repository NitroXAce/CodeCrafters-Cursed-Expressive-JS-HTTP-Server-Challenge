((
    {fs,nodePath,net, match, stringToObj, responseBody} = require('./dependencies'),
    server = net.createServer(socket => (
        socket.on('data', (
            data,

            //breaking down data verbose keys
            [ command, host, agent, encoding] = data.toString().split("\r\n"),
            [verb,path,httpType]=command.split(' '),
            [Host,address]=host.split(' '),
            [userAgent, Agent]=agent.split(' '),
            [,commandName,...chunks] = path.split('/'),

            //getting the directory the tester sends
            dirArg = process.argv.findIndex(el => el === '--directory') + 1,
            dirPath = dirArg && process.argv[dirArg],
            dirDir = dirArg && fs.readdirSync(dirPath)
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
                        fileName = chunks.join('')
                    )=>  
                        dirDir.indexOf(fileName) + 1 
                        ? fs.readFileSync(nodePath.join(dirPath,fileName)).toString('utf-8')
                        : 404
                })
            }) ?? 404
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
