require('dotenv').config()
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const { execSync } = require('child_process')
const app = express()
app.use(bodyParser.json())

const BIND_DIR = '/var/lib/bind'
const ips = ['18.169.249.10']

const port = process.env.PORT || 3000
app.post('/domains', (req, res) => {
    const randomIp = ips[Math.floor(Math.random() * ips.length)]
    const {
        domains = [],
        ip = randomIp
    } = req.body
    const rs = []
    const domainsStatus = {}

    for (let domain of domains) {
        if (!fs.existsSync(`${BIND_DIR}/${domain}.hosts`)) {
            const cmd1 = `sudo bash ${__dirname}/scripts/make-hosts.sh '${domain}' '${ip}' > ${BIND_DIR}/${domain}.hosts`
            const cmd2 = `sudo bash ${__dirname}/scripts/make-zone.sh '${domain}'`
            const cmd3 = `sudo chown bind:bind /var/lib/bind/${domain}.hosts`
            rs.push(execSync(cmd1).toString())
            rs.push(execSync(cmd2).toString())
            rs.push(execSync(cmd3).toString())
        }
        domainsStatus[domain] = true
    }

    execSync('sudo rndc reload')
    res.json({
        status: rs,
        domains: domainsStatus
    })
})

app.delete('/domains/:name', function (req, res) {
    const domain = req.params.name
    const cmd1 = `sudo bash ${__dirname}/scripts/remove-zone.sh '${domain}'`
    const rs = execSync(cmd1)
    execSync('sudo rndc reload')
    res.json({
        rs
    })
})

app.get('/domains/:name', function (req, res) {
    const domain = req.params.name
    const domainPath = `${BIND_DIR}/${domain}.hosts`
    let content = '';
    if (fs.existsSync(domainPath)) {
        content = fs.readFileSync(domainPath, { 'encoding': 'utf8' })
    }
    res.json({
        record: content
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})