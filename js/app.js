var exampleSocket = new WebSocket("wss://doc.w3b.net", ["protocolOne", "protocolTwo"]);
exampleSocket.onmessage = function (event) {
  console.log(event.data);
}
