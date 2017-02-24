Minimal secure NodeJS [WebSocket](https://tools.ietf.org/html/rfc6455) example. No Express, TLS all the way.

What works now: open in browser and receive ws updates in the browser console.log about text that was entered into a server side telnet session, to localhost:9501.

TLS is based on the default NodeJS cipher set, which already receives an A rating at ssllabs.com, if you use an officially signed certificate.

Run server.js with NodeJS version v6.9.5. (Didn't test older versions, this is currently stable)

Make sure you have a proper key and certificate in **k.pem** and **c.pem**.

The client is based on Polymer web components. Currently, a custom element is receiving the WebSocket updates. Work in progress.

```bash
### Fetch the files
git clone git@gitlab.com:nkoster/ws2.git
cd ws2/

### In case you don't have an officially signed
### certificate, create a self-signed certificate
openssl req -x509 -days 3650 -newkey rsa:4096 -keyout k.pem -out c.pem -nodes

### Install necessary npm modules
npm install

### Install necessary bower modules
./node_modules/bower/bin/bower install

### Generate the client code
./node_modules/gulp/bin/gulp.js bower elements html js
### Or
./node_modules/gulp/bin/gulp.js bower elements html js -ws wss://example.net
### (by default, the WebSocket address is wss://localhost:10443)

### Start the server
node server.js
### Or
node server.js -https 443
### (by default, the server uses port 10443)

### Test
ping google.com | nc localhost 9501
### Visit https://localhost:10443 to see the result
```
