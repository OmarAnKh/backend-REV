const geocode = require('./utils/locationAPI')
const weather = require('./utils/weatherAPI')

const address = process.argv[2];

geocode(address, (error, geodata) => {
    if (!error) {
        weather(geodata, (error, data) => {
            if (!error) {
                console.log("The temperature is " + data.temperature + " and is feels like " + data.feelslike)
            }
        })
    }
})