const
  https = require('https'),
  ws = require('websocket').server,
  fs = require('fs'),
  options = {
    key: fs.readFileSync('k.pem'),
    cert: fs.readFileSync('c.pem')
  };

const
  server = https.createServer(options, function(req, res) {
  res.writeHead(200);
  fs.readFile('public/index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    res.end(data);
  });
})

server.listen(443, function() {
  console.log((new Date()) + ' Server started at port 443');
});

wsServer = new ws({
  httpServer: server,
  autoAcceptConnections: true,
  rejectUnauthorized: false
});

wsServer.on('request', function(request) {
  const
    connection = request.accept('echo-protocol', request.origin);
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
