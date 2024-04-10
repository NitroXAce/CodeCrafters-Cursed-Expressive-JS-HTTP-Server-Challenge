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
    )()
})