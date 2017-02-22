var wss = new ReconnectingWebSocket("wss://localhost:10443", ["protocolOne", "protocolTwo"]);
wss.onmessage = function(event) {
  console.log(event.data);
}
