


const test_values = [
    {
        stamp_values: [1,4,10,25],
        stock: [30,10,6,3],
        value: 84
    },
    {
        stamp_values: [5,10,20],
        stock: [1,1,0],
        value: 25
    },{
        stamp_values: [1,6,8],
        stock: [1,1,1],
        value: 12
    }
]


function getPostageArray(stamp_values, stock, value) {
    let final_array = []
    let howmuchrest = value

    for(let i = stamp_values.length - 1; i >= 0; i--) {
        const howmanyneed = Math.floor(howmuchrest / stamp_values[i])
        
        if (howmanyneed <= stock[i]) {
            howmuchrest = howmuchrest % stamp_values[i]
        }
        final_array = [howmanyneed, ...final_array]

    }
    if (howmuchrest > 0) {
        console.error('Not enough stamps')
        return null
    }

    return final_array

}


test_values.forEach((tv,i) => {
    console.log(`Test_${i}`,getPostageArray(tv.stamp_values, tv.stock, tv.value))
})