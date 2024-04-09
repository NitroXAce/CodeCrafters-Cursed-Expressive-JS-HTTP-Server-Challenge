mod=module.exports=()=>({
    match : (input,obj) =>
        typeof obj?.[input] === 'function'
        ? obj[input]()
        : obj?.[input],
    stringToObj : (string,nestObj) =>(
        (
            stringToArr = typeof string === 'string' ? string.split(' ') :string,
            firstArr = stringToArr[0],
            [,...rest] = stringToArr,
            {stringToObj,match} = mod()
        )=>(
            console.log(nestObj?.[firstArr]),
            match(
                typeof nestObj?.[firstArr],{
                    function:()=>nestObj[firstArr](),
                    object:()=>rest.length && (
                        rest.join(' '),
                        stringToArr(rest, nestObj[firstArr])
                    ),
                    default:()=>(
                        console.log(`match returned: ${nestObj?.[firstArr]}`),
                        nestObj?.[firstArr]
                    )
                }
            )
        )
    )()
})