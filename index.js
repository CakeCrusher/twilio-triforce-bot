const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const {response} = require('./keyFinder')
const fs = require('fs');
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = express()
app.use(bodyParser.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.send('Bunny')
})

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse
    const dataString = fs.readFileSync('./data.json')
    const oldData = JSON.parse(dataString)

    const newData = response(req.body, oldData, twiml)
    console.log(newData)

    if (newData === 'won') {
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end()
    } else {
        fs.writeFile('data.json', JSON.stringify(newData), (err, _result) => {
            if (err) console.log(err)
        })
    
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end(twiml.toString())
    }
})

http.createServer(app).listen(4000, () => {
    console.log('Server running on port 4000')
})