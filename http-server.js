const express = require('express')
const bodyParser = require('body-parser')
const diskCache = require('./cache')

const PORT = process.env.HTTP_PORT || 8080
const HOST_MASTER_EMAIL = process.env.HOST_MASTER_EMAIL || 'hostmaster.domainers.com'
const NAME_SERVER = process.env.NAME_SERVER || 'ns1.testnames.link'

const DNS_TTL = process.env.TTL || 3600
const DNS_EXPIRE = process.env.DNS_EXPIRE || 1209600
const DNS_REFRESH = process.env.DNS_REFRESH || 7200
const DNS_RETRY = process.env.DNS_RETRY || 1800

const app = express()
app.use(bodyParser.json())
app.get('/domains/:name', async (req, res) => {
    const name = req.params.name
    const record = await diskCache.get(name)
    if (record) {
        res.json(record)
    } else {
        res.status(404).send('Not Found!')
    }

})

app.put('/domains/:name', async (req, res) => {
    const name = req.params.name
    const data = createDNSRecord(name, req.body)
    await diskCache.set(name, data)
    res.json(data)
})

app.put('/domains/:name/update', async (req, res) => {
    const name = req.params.name
    const { type, value } = req.body
    const zone = await diskCache.get(name)
    if (!zone || !type) {
        res.status(404).end()
    }
    zone[type.toUpperCase()] = value
    await diskCache.set(name, zone)
    res.json(zone)
})

app.get('/ping', function (req, res) {
    res.status(200).send('pong')
})



function createDNSRecord(domain, payload) {
    const {
        ip,
        host_manager = HOST_MASTER_EMAIL,
        name_server = NAME_SERVER,
        ttl = DNS_TTL
    } = payload
    const serial = new Date().toISOString()
        .replace(/T.+/, '')
        .replace(/[^0-9]/g, '') + Math.floor(Math.random() * 100);

    return {
        "SOA": {
            "class": "IN",
            "type": "SOA",
            "name": domain,
            "data": {
                "mname": name_server,
                "rname": host_manager,
                "serial": serial,
                "refresh": DNS_REFRESH,
                "retry": DNS_RETRY,
                "expire": DNS_EXPIRE,
                "ttl": DNS_TTL
            }
        },
        "A": [
            {
                "class": "IN",
                "type": "A",
                "name": domain,
                "data": ip,
                "ttl": ttl
            }
        ]
    }
}


app.listen(PORT, function () {
    console.log('Running at ', PORT)
})

app.on('error', function (err) {
    console.log(err)
})