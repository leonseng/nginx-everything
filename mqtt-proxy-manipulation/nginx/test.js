var client_messages = 1;
var client_id_str = "-";

function getClientId(s) {
  s.on('upload', function (data, flags) {
    if (data.length == 0) {  // Initial calls may contain no data, so
      s.log("No buffer yet"); // ask that we get called again
      //s.done(1);            // (supposing that code=1 means that)
      return;
    } else if (client_messages == 1) { // CONNECT is first packet from the client
      // CONNECT packet is 1, using upper 4 bits (00010000 to 00011111)
      var packet_type_flags_byte = data.charCodeAt(0);
      s.log("MQTT packet type+flags = " + packet_type_flags_byte.toString());
      if (packet_type_flags_byte >= 16 && packet_type_flags_byte < 32) {
        // Calculate remaining length with variable encoding scheme
        var multiplier = 1;
        var remaining_len_val = 0;
        var remaining_len_byte;
        for (var remaining_len_pos = 1; remaining_len_pos < 5; remaining_len_pos++) {
          remaining_len_byte = data.charCodeAt(remaining_len_pos);
          if (remaining_len_byte == 0) break; // Stop decoding on 0
          remaining_len_val += (remaining_len_byte & 127) * multiplier;
          multiplier *= 128;
        }

        // Extract ClientId based on length defined by 2-byte encoding
        var payload_offset = remaining_len_pos + 12; // Skip fixed header
        var client_id_len_msb = data.charCodeAt(payload_offset).toString(16);
        var client_id_len_lsb = data.charCodeAt(payload_offset + 1).toString(16);
        if (client_id_len_lsb.length < 2) client_id_len_lsb = "0" + client_id_len_lsb;
        var client_id_len_int = parseInt(client_id_len_msb + client_id_len_lsb, 16);
        client_id_str = data.substr(payload_offset + 2, client_id_len_int);
        s.log("ClientId value  = " + client_id_str);
      } else {
        s.log("Received unexpected MQTT packet type+flags: " + packet_type_flags_byte.toString());
      }
    }
    client_messages++;
    s.allow();
  });
}

function setClientId(s) {
  return client_id_str;
}