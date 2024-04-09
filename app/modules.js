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
                Object.keys(nestObj)[0],
                stringToArr,
                nestObj,
                firstArr in nestObj,
                'nestObj?.[' + firstArr + ']',
                nestObj?.[firstArr]
            ),
            mod().match(
                typeof nestObj?.[firstArr],{
                    function:()=>(
                        console.log(nestObj[firstArr]),
                        nestObj[firstArr]()
                    ),
                    object:()=>rest.length && (
                        rest.join(splitter),
                        mod().stringToArr(rest, nestObj[firstArr])
                    ),
                    default: nestObj?.[firstArr]
                }
            ) ?? nestObj?.[firstArr]
        )
    )()
})