(function() {
var wsElement = document.querySelector("proto-element");
wsElement.addEventListener('onerror', function(error) {
  throw new Error(error);
});
wsElement.addEventListener('onopen', function() {
  wsElement.send('Thanks!');
});
wsElement.addEventListener('onmessage', function(message) {
  wsElement.textContent = message.detail;
  console.log('Message: ' + message.detail);
});
})();
