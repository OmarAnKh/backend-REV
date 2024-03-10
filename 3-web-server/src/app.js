const express = require('express')
const path = require('path')
const geocode = require('../utils/locationAPI')
const weather = require('../utils/weatherAPI')




const app = express()




app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: "address not found" })
    }
    geocode(req.query.address, (error, data) => {
        if (error) {
            return res.send({ error })
        }
        weather(data, (error, data) => {
            if (error) {
                return res.send({ error })
            }
            res.send(data)
        })
    })

})

app.get('/help', (req, res) => {
    res.send({
        title: 'help page ',
        solve: " "
    })
})

app.get('/about', (req, res) => {
    res.send('hello express!')
})


app.listen(5000, () => {
    console.log('run on port 5000')
})