export default { hello, time, modify_response_body, modify_response_header, hash_req_id, auth }

function hello(r) {
  r.error("Hello")
  r.return(
    200,
    (
      ("Accept" in r.headersIn && r.headersIn["Accept"] == "application/json") ?
        JSON.stringify({ "body": "Hello world" }) :
        "Hello world\n"
    )
  )
  return
}

function time(r) {
  r.subrequest(
    '/proxy/worldtimeapi/api/timezone/Australia/Melbourne',
    { method: "GET" },
    function (res) {
      let subreq_response = JSON.parse(res.responseBuffer);
      r.return(res.status, subreq_response.datetime);
    }
  );

  // ngx.fetch('http://worldtimeapi.org/api/timezone/Australia/Melbourne')
  //   .then(res => res.json())
  //   .then(body => r.return(200, body.datetime))
  //   .catch(e => r.return(501, e.message));
}

// async await requires njs 0.7
/*
async function time(r) {
  let res = await r.subrequest('/proxy/worldtimeapi/api/timezone/Australia/Melbourne')

  if (res.status >= 300) {
    r.error("API call to World Time failed: " + res.responseText)
    r.return(res.status, "API call to World Time failed.")
    return
  }

  var json = JSON.parse(res.responseBuffer)

  r.return(res.status, json.datetime)
}
*/

function modify_response_body(r, data) {
  if (data !== "") {
    let body = JSON.parse(data)
    body["njs"] = "modify_response_body";
    r.sendBuffer(JSON.stringify(body));
  } else {
    r.sendBuffer(data);
  }

  return
}

function modify_response_header(r) {
  r.headersOut["X-njs"] = "modify_response_header";

  // clear out Content-Length header to enforce chunked transfer encoding, as response body was modified in modify_response_body
  delete r.headersOut["Content-Length"];
  return
}

var cr = require('crypto')
function hash_req_id(r) {
  return cr.createHash('sha1').update(r.variables.request_id).digest('base64url');
}

/*
  Retrieves a UUID from httpbin.org/uuid,
  stores it in session_token js_var, and
  returns 200 to simulate a successful auth flow
*/
function auth(r) {
  ngx.fetch('http://httpbin.org/uuid')
    .then(reply => reply.text())
    .then(body => {
      r.variables.session_token = JSON.parse(body).uuid;
      r.error("Auth successful with session token: " + r.variables.session_token);
      ngx.fetch('http://httpbin.org/delay/3')
        .then(reply => reply.text());
      r.return(200);
    })
    .catch(e => r.return(501, e.message));
}
