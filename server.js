'use strict';

/*
process.on('uncaughtException', function (err) {
  console.error((new Date()) + ' Server cannot load');
  process.exit();
});
*/
const
  log = false,
  net = require('net'),
  https = require('https'),
  ws = require('websocket').server,
  fs = require('fs'),
  options = {
    key: fs.readFileSync('k.pem'),
    cert: fs.readFileSync('c.pem')
  };

let port_https = 10443;
if (process.argv.indexOf("-https") != -1) {
  port_https = process.argv[process.argv.indexOf("-https") + 1]; 
}

let port_telnet = 9501;
if (process.argv.indexOf("-telnet") != -1) {
  port_telnet = process.argv[process.argv.indexOf("-telnet") + 1]; 
}

// Does not have any affect, yet...
let host = '0.0.0.0';
if (process.argv.indexOf("-h") != -1) {
  host = process.argv[process.argv.indexOf("-h") + 1];
}

const server = https.createServer(options, function (req, res) {
  let
    fileToLoad = '',
    contentType = 'text/html';
  if (req.url === '/') {
    fileToLoad = 'public/index.html';
  } else {
    fileToLoad = 'public' + req.url;
  }
  let re = /(?:\.([^.]+))?$/;
  let ext = re.exec(fileToLoad)[1];
  if (ext === 'js') {
      contentType = 'application/javascript'
  } else if (ext === 'css') {
      contentType = 'text/css'
  } else if (ext === 'png') {
      contentType = 'image/png'
  } else if (ext === 'svg') {
      contentType = 'image/svg+xml'
  }
  if (fs.existsSync(fileToLoad)) {
    if (log) console.log((new Date()) + ' ' + req.connection.remoteAddress + ' URI: ' + fileToLoad + ' (' + contentType + ')');
    res.writeHeader(200, {"Content-Type": contentType});
    fs.readFile(fileToLoad, 'utf8', function (err, data) {
      if (err) {
       if (log) return console.log((new Date()) + ' ' + err);
      }
      res.end(data);
    });
  } else {
    if (log) console.log((new Date()) + ' ' + req.connection.remoteAddress + ' not found: ' + fileToLoad);
    res.writeHeader(404, {"Content-Type": "text/html"});
    res.write("404 Not Found\n");
    res.end();
  }
});

server.listen(port_https, function () {
  console.log((new Date()) + ' https server started at ' + host + ':' + port_https);
});

const wsServer = new ws({
  httpServer: server,
  autoAcceptConnections: true,
  rejectUnauthorized: false
});

wsServer.on('request', function (request) {
  let connection = request.accept(null, request.origin);
  if (log) console.log((new Date()) + ' Connection accepted');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      if (log) console.log((new Date()) + ' Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      if (log) console.log((new Date()) + ' Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function (reasonCode, description) {
    if (log) console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

const telnetServer = net.createServer(function (sock) {
  if (log) console.log((new Date()) + ' telnet connection ' + sock.remoteAddress);
  sock.on('data', function (data) {
    let dataToSend = '' + data;
    wsServer.connections.forEach(function(c) {
      c.send(dataToSend, function () { /* no err handler */ });
    if (log) process.stdout.write((new Date()) + ' websocket broadcast: ' + dataToSend);
    });
  });
  sock.on('close', function (data) {
    if (log) console.log((new Date()) + ' closed ' + sock.remoteAddress);
  });
});

telnetServer.listen(port_telnet, function () {
  console.log((new Date()) + ' telnet server started at port ' + host + ':' + port_telnet);
});
