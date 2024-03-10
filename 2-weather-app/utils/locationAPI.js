const request = require('request')
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoib21hcmFua2giLCJhIjoiY2xsNHd0N3owMGJraDNrbGFxaWJoM2wzZCJ9.by_2A7C0maKUnMuMu-TMBQ&limit=1'

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback("Unable to connect to location service", undefined)
        } else if (response.body.features.length === 0) {
            callback("Unable to find location", undefined)
        } else {

            callback(undefined, response.body.features[0].center)
        }
    })

}
module.exports = geocode