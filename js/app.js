(function () {

var wss = new ReconnectingWebSocket('%%WS%%', ["protocolOne", "protocolTwo"]);
wss.onmessage = function(event) {
  console.log(event.data);
}

})();
