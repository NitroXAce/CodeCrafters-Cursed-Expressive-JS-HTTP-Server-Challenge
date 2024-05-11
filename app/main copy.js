const { fs, nodePath, net, match, responseBody } = require('./dependencies');
const server = net.createServer(socket => {
    socket.on('data', data => {

        //breaking down data verbose keys
        const [ command, host, agent, contentLength, encoding, space, content ] = data.toString().split("\r\n");
        const [ verb, path, httpType ] = command.split(' ');
        const [ Host, address ] = host.split(' ');
        const [ userAgent, Agent ] = agent.split(' ');
        const [ , commandName, ...chunks ] = path.split('/');

        //getting the directory the tester sends
        const dirArg = process.argv.findIndex(el => el === '--directory') + 1;
        const fileName = chunks.join('');
        let dirPath, dirDir;
        
        //if there is any directories in the process when prompted
        //save those values
        if (dirArg) {
            dirPath = process.argv[dirArg];
            dirDir = fs.readdirSync(dirPath);
        }

        //send the response back to the server
        responseBody(
            socket,
            match(commandName,{
                'files' : 'application/octet-stream',
                default : 'text/plain'
            }),
            match(verb,{
                GET(){
                    match(path,{
                        '/':200,
                        '/user-agent':Agent,
                        [`/echo/${chunks.join('/')}`]: chunks.join('/'),
                        [`/files/${chunks.join('')}`](){ 
                            if (dirDir.indexOf(fileName) + 1)
                                return fs.readFileSync(nodePath.join(dirPath,fileName)).toString('utf-8');
                            return 0;
                        },
                        default : 404
                    })
                },
                POST(){
                    match(commandName,{
                        files(){
                            fs.writeFileSync(
                                nodePath.join(dirPath,fileName),
                                content,
                                'utf-8'
                            );
                            return 201;
                        },
                        default : 404
                    })
                }
            })
        );

        socket.on("close", function(){
            socket.end();
            socket.close();
        });
    });
});

server.listen(4221, "localhost");

