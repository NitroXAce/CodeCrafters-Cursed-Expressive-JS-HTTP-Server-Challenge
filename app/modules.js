mod=module.exports=()=>({
    match : (input,obj) =>
        typeof obj?.[input] === 'function'
        ? obj[input]()
        : obj?.[input],
    stringToObj : (string,nestObj,splitter = ' ') =>(
        (
            stringToArr = typeof string === 'string' ? string.split(splitter) :string,
            [firstArr,...rest] = stringToArr,
            {stringToObj,match} = mod()
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
            ) ?? nestObj?.[firstArr]
        )
    )(),
    responseBody : send => send?.length > 1 
        ?[
            'HTTP/1.1 200 OK\r\n',
            `Content-Type: text/plain\r\n`,
            `Content-length: ${send.length}\r\n`,
            '\r\n',
            send
        ].join('')
        : send === '404'
        ? "HTTP/1.1 404 Not Found\r\n\r\n"
        : 'HTTP/1.1 200 OK\r\n\r\n'
})