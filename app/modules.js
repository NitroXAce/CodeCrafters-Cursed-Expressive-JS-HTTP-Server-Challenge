((
    match = (input,obj) => 
        typeof obj?.[input] === 'function'
            ? obj[input]()
            : obj?.[input],
    responseBody = (socket,content = 'text/plain',send) => 
        match(typeof send,{
            number:()=> match(send,{
                0: ()=>socket.end(
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
                ),
                200: ()=> socket.write('HTTP/1.1 200 OK\r\n\r\n'),
                201: ()=> socket.write('HTTP/1.1 201 CREATED\r\n\r\n'),
                404: ()=> socket.write("HTTP/1.1 404 Not Found\r\n\r\n"),
                500: ()=> socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n"),
            }),
            string: ()=> socket.write(
                send?.length
                ? [
                    'HTTP/1.1 200 OK\r\n',
                    `Content-Type: ${content}\r\n`,
                    `Content-length: ${send.length}\r\n`,
                    '\r\n',
                    send
                ].join('')
                : "HTTP/1.1 500 Internal Server Error\r\n\r\n"
            ),
            default : ()=> socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }),
    httpBody = body => ((
        bodyArr = body.toString().split('\r\n'),
        bodyObj = {}
    )=>(
        bodyArr.forEach((method,index)=>((
            [
                key = 'blank',
                ...properties
            ] = method.split(' ')
        )=>
            index === bodyArr.length -1 
            ? bodyObj.content = method
            : bodyObj[key.replaceAll(':','')] = properties
        )()),
        bodyObj
    ))()
)=>module.exports={
    match,responseBody,httpBody
})()