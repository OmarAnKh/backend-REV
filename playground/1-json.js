const fs = require('fs')

// const book = {
//     title: "Ego is the Enemy",
//     author: "Ryan Holiday"
// }


// const bookJson = JSON.stringify(book)
// fs.writeFileSync('1-json.json')

// const parsedData = JSON.parse(bookJson)

// console.log(parsedData)


const dataBuffer = fs.readFileSync('1-json.json')
const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)
data.name = "Omar"
data.planet = "earth"
data.age = 20
const jsondata = JSON.stringify(data)
fs.writeFileSync('1-json.json', jsondata)