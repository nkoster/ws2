(function () {

var screenBuffer = [];
var screenChanged = false;
var content = '';
var counter = 0;
var lineHeight = 17;
var monitorHeight = window.innerHeight;
var numberOfLines = Math.floor(monitorHeight / lineHeight) - 1;
if (numberOfLines < 3) { numberOfLines = 3; }

window.onresize = function () {
  monitorHeight = window.innerHeight;
  var newNumberOfLines = Math.floor(monitorHeight / lineHeight) - 1;
  if (newNumberOfLines < 3) { newNumberOfLines = 3; }
  numberOfLines = newNumberOfLines;
  screenChanged = true;
};

var wsElement = document.querySelector("proto-element");

wsElement.addEventListener('onerror', function (error) {
  throw new Error(error);
});
wsElement.addEventListener('onopen', function () {
  wsElement.send('Thanks!');
});
wsElement.addEventListener('onmessage', function (message) {
  message.detail.split("\n").forEach(function (item) {
    if (item) updateScreen(item + '\n');
  });
});

function updateScreen(d) {
  var i, buf = [];
  screenBuffer[counter] = d;
  buf = screenBuffer.slice();
  for (i = 0; i < buf.length; i++) {
    if (i === counter) {
      buf[i] = '-> ' + buf[i];
    }
  }
  if (screenChanged) {
    screenChanged = false;
    screenBuffer.splice(numberOfLines);
    content.split("\n").slice(numberOfLines).join("\n");
    if (counter > numberOfLines) { counter = numberOfLines; }
  }
  wsElement.screenBuffer = buf.slice();
  if (counter < (numberOfLines - 1)) {
    counter += 1;
  } else {
    counter = 0;
  }
}

})();
