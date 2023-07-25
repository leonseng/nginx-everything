import x509 from 'x509.js';

var ALLOWED_SPIFFE_IDS = [
  "spiffe://example.org/client-a"
]

function http_verify_client_spiffe_id(r) {
  if (is_allowed_spiffe_id(r, r.variables.ssl_client_raw_cert)) {
    r.return(200);
  } else {
    r.return(403);
  }
}

function stream_verify_client_spiffe_id(s) {
  s.on('upload', function (data, flags) {
    if (is_allowed_spiffe_id(s, s.variables.ssl_client_raw_cert)) {
      s.done();
    } else {
      s.deny();
    }
  });
}

function is_allowed_spiffe_id(q, pem_cert) {
  if (!pem_cert) {
    q.error("No client certificate");
    return false;
  }

  var cert = x509.parse_pem_cert(pem_cert);

  // subjectAltName oid 2.5.29.17
  var san = x509.get_oid_value(cert, "2.5.29.17")[0];

  // get SPIFFE ID
  var spiffe_ids = san.filter(item => item.startsWith("spiffe://"));
  if (spiffe_ids.length !== 1) {
    q.error(`Found ${spiffe_id.length} SPIFFE ID(s) in the client certificate. There should be exactly 1 SPIFFE ID in client certificate Subject Alternative Names.`);
    return false;
  }

  // check SPIFFE ID
  if (!ALLOWED_SPIFFE_IDS.includes(spiffe_ids[0])) {
    q.error(`'${spiffe_ids[0]}' is NOT in the allow list for accessing this endpoint.`);
    return false;
  }

  return true;
}

export default { http_verify_client_spiffe_id, stream_verify_client_spiffe_id };
