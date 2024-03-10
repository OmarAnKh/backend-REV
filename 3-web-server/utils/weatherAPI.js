const request = require('request')
const weather = (geo, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=2deb5f7be12797b32a95ff5225361aa4&query=' + encodeURIComponent(geo[0]) + ',' + encodeURIComponent(geo[1])
    request({ url: url, json: true }, (error, response) => {

        if (error) {
            callback("Unable to connect to weather service", undefined)
        } else if (response.body.error) {
            callback("Unable to find location", undefined)
        }
        else {
            
            callback(undefined, response.body.current)
        }
    })

}


module.exports = weather