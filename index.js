require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { execSync } = require('child_process')
const app = express()
app.use(bodyParser.json())

const ips = ['18.169.249.10', '18.169.249.11']

const port = process.env.PORT || 3000
app.post('/domains', (req, res) => {
    const randomIp = ips[Math.floor(Math.random() * ips.length)]
    const {
        domains = [],
        ip = randomIp
    } = req.body

    for (let domain of domains) {
        const cmd = `bash ${__dirname}/scripts/make-zone.sh '${domain}' '${ip}'`
        console.log(cmd)
        execSync(cmd)
    }

    // execSync('rndc reload')
})

app.delete('/domains/:name', function (req, res) {
    const domain = req.params.name



    res.json({})
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})