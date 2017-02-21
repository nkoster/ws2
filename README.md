Minimal secure NodeJS [WebSocket](https://tools.ietf.org/html/rfc6455) example. No Express, TLS all the way.

What works now: open in browser and receive ws updates in the browser console.log about text that was entered into a server side telnet session, to localhost:9501.

TLS is based on the default NodeJS cipher set, which already receives an A rating at ssllabs.com.

The client example is extracted from https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

Run server.js with NodeJS version v6.9.5. (Didn't test older versions, this is currently stable)

Make sure you have a proper key and certificate in **k.pem** and **c.pem**.

```bash
git clone git@gitlab.com:nkoster/ws2.git
cd ws2/
### In case you don't have an officially signed
### certificate, create a self-signed certificate
openssl req -x509 -days 3650 -newkey rsa:4096 -keyout k.pem -out c.pem -nodes
npm install
./node_modules/gulp/bin/gulp.js html js
node server.js
```
