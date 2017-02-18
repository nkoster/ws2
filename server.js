const
  net = require('net'),
  https = require('https'),
  ws = require('websocket').server,
  fs = require('fs'),
  options = {
    key: fs.readFileSync('k.pem'),
    cert: fs.readFileSync('c.pem')
  };

const server = https.createServer(options, function(req, res) {
  let fileToLoad = '';
  if (req.url === '/') {
    fileToLoad = 'public/index.html';
  } else {
    fileToLoad = 'public' + req.url;
  }
  if (fs.existsSync(fileToLoad)) {
    console.log((new Date()) + ' ' + req.connection.remoteAddress + ' URI: ' + fileToLoad);
    res.writeHeader(200, {"Content-Type": "text/html"});
    fs.readFile(fileToLoad, 'utf8', function(err, data) {
      if (err) {
       return console.log((new Date()) + ' ' + err);
      }
      res.end(data);
    });
  } else {
    console.log((new Date()) + ' ' + req.connection.remoteAddress + ' not found: ' + fileToLoad);
    res.writeHeader(404, {"Content-Type": "text/html"});
    res.write("404 Not Found\n");
    res.end();
  }
});

server.listen(443, function() {
  console.log((new Date()) + ' https server started at port 443');
});

wsServer = new ws({
  httpServer: server,
  autoAcceptConnections: true,
  rejectUnauthorized: false
});

wsServer.on('request', function(request) {
  let connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection accepted');
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

const telnetServer = net.createServer(function(sock) {
  console.log((new Date()) + ' telnet connection ' + sock.remoteAddress);
  sock.on('data', function(data) {
    let dataToSend = '' + data;
    wsServer.connections.forEach(function(c) {
      c.send(dataToSend, function() { /* no err handler */ });
    process.stdout.write((new Date()) + ' websocket broadcast: ' + dataToSend);
    });
  });
  sock.on('close', function(data) {
    console.log((new Date()) + ' closed ' + sock.remoteAddress);
  });
});

telnetServer.listen(9501, function() {
  console.log((new Date()) + ' telnet server started at port 9501');
});
