((
    match = (input,obj) => typeof obj?.[input] === 'function'
        ? obj[input]()
        : obj?.[input],
    stringToObj = (string,nestObj,splitter = ' ') =>((
        stringToArr = typeof string === 'string' ? string.split(splitter) :string,
        [firstArr,...rest] = stringToArr,
    )=>(
        console.log(
            firstArr,
            Object.keys(nestObj),
            stringToArr,
            firstArr in nestObj,
            'nestObj?.[' + firstArr + ']'
        ),
        match( typeof nestObj?.[firstArr],{
            function:()=>nestObj[firstArr](),
            object:()=>rest.length && (
                rest.join(splitter),
                stringToObj(rest, nestObj[firstArr])
            ),
            default: nestObj?.[firstArr]
        })
    ))(),
    responseBody = (socket,content = 'text/plain',send) => match(typeof send,{
        number:match(send,{
            0: ()=>socket.end(
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
            ),
            200: socket.write('HTTP/1.1 200 OK\r\n\r\n'),
            404: socket.write("HTTP/1.1 404 Not Found\r\n\r\n"),
            500: socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n"),
        }),
        string: send?.length && socket.write([
            'HTTP/1.1 200 OK\r\n',
            `Content-Type: ${content}\r\n`,
            `Content-length: ${send.length}\r\n`,
            '\r\n',
            send
        ].join('')),
        default : socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
    })
)=>module.exports={
    match,stringToObj,responseBody
})()