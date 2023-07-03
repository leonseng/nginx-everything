function mask_body(r, data, flags) {
  r.variables.masked_request_json = mask(r.requestText);

  // response data can come in multiple chunks. Merge all chunks before masking data as a whole
  r.variables.masked_response_json += data

  if (flags.last) {
    r.variables.masked_response_json = mask(r.variables.masked_response_json);
  }

  r.sendBuffer(data, flags);
}

function mask(text) {
  const reAuMobile = /04\d{8}/g;
  const reCreditCard = /[45]\d{15}/g;
  const reIpAddr = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
  let masked_raw = text.replace(reAuMobile, '04xxxxxxxx');
  masked_raw = masked_raw.replace(reCreditCard, 'xxxxxxxxxxxxxxx');
  masked_raw = masked_raw.replace(reIpAddr, 'x.x.x.x');
  let masked = JSON.parse(masked_raw);
  return JSON.stringify(masked);
}

export default { mask_body };