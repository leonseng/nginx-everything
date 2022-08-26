var line = '';
function test(s) {
  s.on('upload', function (data, flags) {
    if (data.length == 0) {
      s.log("No buffer yet");
      return;
    } else {
      if (data.charCodeAt(0) == 16) {  // CONNECT
        s.log(data);
        var hexData = strToHex(data)
        s.log(hexData);

        // replace client ID
        var replacedData = data.replace('iotdev', 'lnginx');
        s.send(replacedData, flags);
        s.off('upload');  // stop processing stream. Comment out to keep processing payload
      }
    }
  });
}

function strToHex(s) {
  return s.split("")
    .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function hexToStr(h) {
  return h.split(/(\w\w)/g)
    .filter(p => !!p)
    .map(c => String.fromCharCode(parseInt(c, 16)))
    .join("")
}

export default { test };
