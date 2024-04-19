function match(input,obj){
    const condition = obj?.[input];
    if (typeof condition === 'function')
        return condition();
    return condition;
}

function responseBody(socket,content,send){
    if(!content) content = 'text/plain';

    return match(typeof send,{
        number(){
            match(send,{
                0(){
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                    return socket.end();
                },
                200(){
                    return socket.write('HTTP/1.1 200 OK\r\n\r\n');
                },
                201(){
                    return socket.write('HTTP/1.1 201 CREATED\r\n\r\n');
                },
                404(){
                    return socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
                },
                500(){
                    return socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
                },
            })
        },
        string(){
            if(send?.length) return socket.write([
                'HTTP/1.1 200 OK\r\n',
                `Content-Type: ${content}\r\n`,
                `Content-length: ${send.length}\r\n`,
                '\r\n',
                send
            ].join(''));

            return socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
        },
        default(){
            return socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
    });

}

module.exports={
    match,responseBody
};