mod=module.exports=()=>({
    match : (input,obj) =>
        typeof obj?.[input] === 'function'
        ? obj[input]()
        : obj?.[input],
    stringToObj : (string,nestObj,splitter = ' ') =>(
        (
            stringToArr = typeof string === 'string' ? string.split(splitter) :string,
            firstArr = stringToArr[0],
            [,...rest] = stringToArr,
            {stringToObj,match} = mod()
        )=>(
            console.log(
                firstArr,
                nestObj,
                'nestObj?.[' + firstArr + ']',
                nestObj?.[firstArr]
            ),
            match(
                typeof nestObj?.[firstArr],{
                    function:()=>nestObj[firstArr](),
                    object:()=>rest.length && (
                        rest.join(splitter),
                        stringToArr(rest, nestObj[firstArr])
                    )
                }
            ) ?? nestObj?.[firstArr]
        )
    )()
})