require('dotenv').config()

const fs = require('fs')
const dnsd = require('dnsd')
const diskCache = require('./cache')


const PORT = process.env.DNS_PORT || 5333
const HOST = process.env.HOST || 'localhost'

const server = dnsd.createServer(handler)

server.listen(PORT, HOST)

async function handler(req, res) {
    const question = res.question[0]
    const qHostname = question.name
    const qType = question.type
    const parseZone = await diskCache.get(qHostname)
    if (!parseZone) {
        res.end()
        return
    }
    if (question.type == 'A') {
        const answer = parseZone[qType].find(e => e.name === qHostname)
        res.answer.push(answer)
    }
    if (qType === 'SOA') {
        server.zones[qHostname] = parseZone[qType]
        console.log(server.zones)
    }
    res.end()
    delete server.zones[qHostname]
}