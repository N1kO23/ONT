import { IPProtocol, InternetPackage } from "../misc/frameTypes";

function decodeNetworkPacket(buf: Buffer): InternetPackage {
  if (buf.length < 20) {
    throw new Error("Invalid Internet packet");
  }

  // The offset acts as a pointer to where we are decoding from
  let offset = 0;

  const version = buf.slice(offset, offset + 1).toString("hex"); // @FIXME: Should be 4 bits instead of byte
  offset += 2;

  const totalLength = buf.slice(offset, offset + 2).toString("hex"); // @FIXME: Should be 4 bits instead of byte
  offset += 2;

  offset += 4; // Skip the 4 bytes of IP header data

  const ttl = buf.slice(offset, offset + 1).toString("hex");
  offset += 1;

  const protocol = Number.parseInt(
    buf.slice(offset, offset + 1).toString("hex"),
    16
  );
  offset += 3;

  const ipSource = buf.slice(offset, offset + 4).toString("hex");
  offset += 4;

  const ipDestination = buf.slice(offset, offset + 4).toString("hex");
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

export { decodeNetworkPacket };
