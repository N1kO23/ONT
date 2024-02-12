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
  // Extracting the header length
  const ihl = buf.readUInt8(offset) & 0x0f;

  // if (buf.length > 60 && version == NetworkProtocol.IPv4) {
  //   throw new Error("Invalid IPv4 packet");
  // } else if (buf.length != 60 && version == NetworkProtocol.IPv6) {
  //   throw new Error("Invalid IPv6 packet");
  // }

  if (version == NetworkProtocol.IPv4) {
    offset += 2;
  } else if (version == NetworkProtocol.IPv6) {
    offset += 4;
  } else {
    throw new Error("Invalid Internet packet version: " + version);
  }

  const totalLength =
    version == NetworkProtocol.IPv4
      ? buf.readUInt16BE(offset)
      : buf.readUInt16BE(offset);
  offset += 2;

  if (version == NetworkProtocol.IPv4) offset += 4; // Skip the 4 bytes of IP header data

  const ttl =
    version == NetworkProtocol.IPv4 ? buf.readUInt8(offset) : buf.readUInt8(8); // IPv6 TTL is 9th byte in the header;
  offset += 1;

  const protocol =
    version == NetworkProtocol.IPv4
      ? (buf.readUInt8(offset) as IPProtocol)
      : (buf.readUInt8(6) as IPProtocol); // IPv6 proto is 7th byte in the header;
  offset += version == NetworkProtocol.IPv4 ? 3 : 1;

  const ipSource =
    version == NetworkProtocol.IPv4
      ? parseIPv4(buf.slice(offset, offset + 4).toString("hex"))
      : parseIPv6(buf.slice(offset, offset + 16).toString("hex"));
  offset += version == NetworkProtocol.IPv4 ? 4 : 16;

  const ipDestination =
    version == NetworkProtocol.IPv4
      ? parseIPv4(buf.slice(offset, offset + 4).toString("hex"))
      : parseIPv6(buf.slice(offset, offset + 16).toString("hex"));
  offset += version == NetworkProtocol.IPv4 ? 4 : 16;

  const options =
    version == NetworkProtocol.IPv4 && ihl > 5
      ? buf.slice(offset, offset + (ihl - 5) * 4).toString("hex")
      : undefined;
  if (version == NetworkProtocol.IPv4) {
    offset += (ihl - 5) * 4;
  }

  const payload = buf.slice(offset);

  const internetPackage: InternetPackage = {
    version,
    ihl,
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

function parseIPv4(ip: string) {
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

function parseIPv6(ip: string) {
  const groups = ip.match(/.{1,4}/g);

  if (groups && groups.length === 8) {
    // Convert each group from hexadecimal to decimal
    const decimalValues = groups.map((group) => parseInt(group, 16));

    // Format each decimal value as a hexadecimal string with leading zeros
    const hexStrings = decimalValues.map((value) =>
      value.toString(16).padStart(4, "0")
    );

    // Join the hexadecimal strings to form the IPv6 address string
    const ipAddress = hexStrings.join(":");
    return ipAddress;
  }

  throw new Error("Invalid IPv6 address: " + ip);
}

export { decodeNetworkPacket };
