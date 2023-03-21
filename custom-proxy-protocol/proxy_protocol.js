export default { inject_pp_header }

function inject_pp_header(s) {
  s.on('upload', function (data) {
    s.send(`PROXY TCP4 1.2.3.4 5.6.7.8 1234 ${s.variables.dport}\r\n`);
    s.off('upload');
    s.send(data);
  });
}