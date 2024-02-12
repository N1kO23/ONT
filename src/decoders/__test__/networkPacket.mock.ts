import { IPProtocol } from "../../misc/frameTypes";

type NetworkGeneratorOptions = {
  version: number;
  ihl?: number;
  totalLength?: number;
  ttl?: number;
  protocol?: IPProtocol;
  ipSource?: string;
  ipDestination?: string;
  options?: string;
  payload?: string;
};

function generatePseudoRandomBytes(length: number): string {
  const randomBytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }

  const hexString = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hexString;
}

function createHeaderByte(version: number, ihl: number): string {
  version &= 0x0f;
  ihl &= 0x0f;

  const headerByte = (version << 4) | ihl;

  return headerByte.toString(16);
}

function generateFakeNetworkPacket(opts: NetworkGeneratorOptions): Buffer {
  // Deconstruct options
  const {
    version,
    ihl,
    totalLength,
    ttl,
    protocol,
    ipSource,
    ipDestination,
    options,
    payload,
  } = opts;

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateRandomIP = (version: number) => {
    const getRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    if (version === 4) {
      // Generate IPv4
      const randomIpParts = Array.from({ length: 4 }, () =>
        getRandomNumber(0, 255)
      );
      return randomIpParts;
    } else if (version === 6) {
      // Generate IPv6
      const randomIpParts = Array.from({ length: 8 }, () =>
        getRandomNumber(0, 65535)
      );
      return randomIpParts;
    } else {
      throw new Error("Invalid IP version. Supported versions are 4 and 6.");
    }
  };

  // Header length
  const headerLength = options
    ? Buffer.from(options).length / 4
    : ihl ?? getRandomNumber(5, 15);

  // Header options
  const headerOptions = options
    ? Buffer.from(options, "hex")
    : Buffer.from(generatePseudoRandomBytes((headerLength - 5) * 4), "hex");

  const headerTtl = ttl ?? getRandomNumber(0, 255);
  const headerProtocol = protocol ?? getRandomNumber(0, 255);

  // Packet IPs
  const sourceIP =
    ipSource?.split(".").map((octet) => Number.parseInt(octet)) ??
    generateRandomIP(version);
  const destIP =
    ipDestination?.split(".").map((octet) => Number.parseInt(octet)) ??
    generateRandomIP(version);

  // Payload envelope
  const IPPayload = Buffer.from(payload ?? "SamplePayload", "utf8");

  const packetBuffer = Buffer.alloc(
    IPPayload.length + (version === 4 ? headerLength * 4 : 40)
  );

  // Version & IHL
  packetBuffer.write(createHeaderByte(version, headerLength), 0, 1, "hex");
  // Filler
  packetBuffer.write(generatePseudoRandomBytes(1), 1, 1, "hex");
  // Total length
  packetBuffer.write(
    packetBuffer.length.toString(16).padStart(4, "0"),
    2,
    2,
    "hex"
  );
  // Filler
  packetBuffer.write(generatePseudoRandomBytes(4), 4, 4, "hex");
  // TTL
  packetBuffer.write(headerTtl.toString(16).padStart(2, "0"), 8, 1, "hex");
  // Protocol
  packetBuffer.write(headerProtocol.toString(16).padStart(2, "0"), 9, 1, "hex");
  // Source IP
  packetBuffer.write(
    sourceIP.map((byte) => byte.toString(16).padStart(2, "0")).join(""),
    12,
    4,
    "hex"
  );
  // Destination IP
  packetBuffer.write(
    destIP.map((byte) => byte.toString(16).padStart(2, "0")).join(""),
    16,
    4,
    "hex"
  );
  // Options
  headerOptions.copy(packetBuffer, 20);
  // Payload
  IPPayload.copy(packetBuffer, headerLength * 4);

  return packetBuffer;
}

export { generateFakeNetworkPacket };
