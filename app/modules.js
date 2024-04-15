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
        match(
            typeof nestObj?.[firstArr],{
                function:()=>nestObj[firstArr](),
                object:()=>rest.length && (
                    rest.join(splitter),
                    stringToObj(rest, nestObj[firstArr])
                ),
                default: nestObj?.[firstArr]
            }
        )
    ))(),
    responseBody = send => match(typeof send,{
        number:`HTTP/1.1 ${match(send,{
            200: '200 OK',
            404: "404 Not Found",
            500: "500 Internal Server Error"
        })}\r\n\r\n`,
        string: send?.length && [
            'HTTP/1.1 200 OK\r\n',
            `Content-Type: text/plain\r\n`,
            `Content-length: ${send.length}\r\n`,
            '\r\n',
            send
        ].join('')
    })
)=>module.exports={
    match,stringToObj,responseBody
})()