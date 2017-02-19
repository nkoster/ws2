var wss = new WebSocket("wss://doc.w3b.net", ["protocolOne", "protocolTwo"]);
wss.onmessage = function(event) {
  console.log(event.data);
}
