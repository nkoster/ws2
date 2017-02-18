Simple WebSocket example. No Express, TLS all the way.

[WebSocket is supported](https://tools.ietf.org/html/rfc6455)

What works now: open in browser and receive ws updates in the browser console.log about text that was entered into a server side telnet session, to localhost:9501.

TLS is based on the default cipher set, which already receives an A rating at ssllabs.com.

Run server.js with Nodejs version v6.9.5. (I didn't tested older versions, this is currently stable)

```bash
node server.js
```
