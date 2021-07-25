## Development

Run http-server.js for manage dns record
Run index.js for dns queries

## Allow port 53
```
sudo setcap 'cap_net_bind_service=+ep' `which node`
```