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
    responseBody = (content = 'text/plain',send) => match(typeof send,{
        number:match(send,{
            200: 'HTTP/1.1 200 OK\r\n\r\n',
            404: "HTTP/1.1 404 Not Found\r\n\r\n",
            500: "HTTP/1.1 500 Internal Server Error\r\n\r\n",
        }),
        string: send?.length && [
            'HTTP/1.1 200 OK\r\n',
            `Content-Type: ${content}\r\n`,
            `Content-length: ${send.length}\r\n`,
            '\r\n',
            send
        ].join('')
    })
)=>module.exports={
    match,stringToObj,responseBody
})()