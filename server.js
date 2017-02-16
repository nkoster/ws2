const
  https = require('https'),
  fs = require('fs'),
  options = {
    key: fs.readFileSync('k.pem'),
    cert: fs.readFileSync('c.pem')
  };

https.createServer(options, function(req, res) {
  res.writeHead(200);
  fs.readFile('public/index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    res.end(data);
  });
}).listen(443);
