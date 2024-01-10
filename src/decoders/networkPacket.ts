import {
  IPProtocol,
  InternetPackage,
  NetworkProtocol,
} from "../misc/frameTypes";

function decodeNetworkPacket(buf: Buffer): InternetPackage {
  if (buf.length < 20) {
    throw new Error("Invalid Internet packet");
  }

  // The offset acts as a pointer to where we are decoding from
  let offset = 0;

  // Extracting version (first 4 bits)
  const version = (buf.readUInt8(offset) >> 4) & 0x0f;
  if (version == NetworkProtocol.IPv4) offset += 2;
  else offset += 4;

  const totalLength = buf.readUInt16BE(offset); // @FIXME: Should be 4 bits instead of byte
  offset += 2;

  if (version == NetworkProtocol.IPv4) offset += 4; // Skip the 4 bytes of IP header data

  const ttl = buf.readUInt8(offset);
  offset += 1;

  const protocol = Number.parseInt(
    buf.slice(offset, offset + 1).toString("hex"),
    16
  );
  offset += 3;

  const ipSource = parseIP(buf.slice(offset, offset + 4).toString("hex"));
  offset += 4;

  const ipDestination = parseIP(buf.slice(offset, offset + 4).toString("hex"));
  offset += 4;

  const options = buf.slice(offset, offset + 40).toString("hex");
  offset += 40;

  const payload = buf.slice(offset);

  const internetPackage: InternetPackage = {
    version,
    totalLength,
    ttl,
    protocol,
    ipSource,
    ipDestination,
    options,
    payload,
  };

  return internetPackage;
}

function parseIP(ip: string) {
  const pairs = ip.match(/.{1,2}/g);

  if (pairs) {
    // Convert each pair from hexadecimal to decimal
    const decimalValues = pairs.map((pair) => parseInt(pair, 16));

    // Join the decimal values to form the IP address string
    const ipAddress = decimalValues.join(".");
    return ipAddress;
  }
  throw new Error("Invalid IP address: " + ip);
}

export { decodeNetworkPacket };
