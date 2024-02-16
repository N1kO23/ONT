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

function combineToByte(first: number, second: number): string {
  first &= 0x0f;
  second &= 0x0f;

  const combinedByte = (first << 4) | second;

  return combinedByte.toString(16);
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
  const headerLength =
    version === 4
      ? options
        ? Buffer.from(options).length / 4
        : ihl ?? getRandomNumber(5, 15)
      : 10;

  // Header options
  const headerOptions =
    version === 4
      ? options
        ? Buffer.from(options, "hex")
        : Buffer.from(generatePseudoRandomBytes((headerLength - 5) * 4), "hex")
      : undefined;

  const headerTtl = ttl ?? getRandomNumber(0, 255);
  const headerProtocol = protocol ?? getRandomNumber(0, 255);

  // Packet IPs
  const sourceIP =
    (version === 4
      ? ipSource?.split(".").map((octet) => Number.parseInt(octet))
      : ipSource?.split(":").map((octet) => Number.parseInt("0x" + octet))) ??
    generateRandomIP(version);
  const destIP =
    (version === 4
      ? ipDestination?.split(".").map((octet) => Number.parseInt(octet))
      : ipDestination
          ?.split(":")
          .map((octet) => Number.parseInt("0x" + octet))) ??
    generateRandomIP(version);

  // Payload envelope
  const IPPayload = Buffer.from(payload ?? "SamplePayload", "utf8");

  const packetBuffer = Buffer.alloc(IPPayload.length + headerLength * 4);

  // Version & IHL, IPv6 doesn't have IHL but the traffic class is not supported yet so it wont be a problem
  packetBuffer.write(combineToByte(version, headerLength), 0, 1, "hex");
  // Filler
  let fillerAmount = version === 4 ? 1 : 3;
  packetBuffer.write(
    generatePseudoRandomBytes(fillerAmount),
    1,
    fillerAmount,
    "hex"
  );
  // Total length
  packetBuffer.write(
    packetBuffer.length.toString(16).padStart(4, "0"),
    version === 4 ? 2 : 4,
    2,
    "hex"
  );
  // Filler
  version === 4 &&
    packetBuffer.write(generatePseudoRandomBytes(4), 4, 4, "hex");
  // TTL, 8th byte on both versions
  packetBuffer.write(
    headerTtl.toString(16).padStart(2, "0"),
    version === 4 ? 8 : 7,
    1,
    "hex"
  );
  // Protocol
  packetBuffer.write(
    headerProtocol.toString(16).padStart(2, "0"),
    version === 4 ? 9 : 6,
    1,
    "hex"
  );
  // Source IP
  packetBuffer.write(
    sourceIP
      .map((byte) => byte.toString(16).padStart(version === 4 ? 2 : 4, "0"))
      .join(""),
    version === 4 ? 12 : 8,
    version === 4 ? 4 : 16,
    "hex"
  );
  // Destination IP
  packetBuffer.write(
    destIP
      .map((byte) => byte.toString(16).padStart(version === 4 ? 2 : 4, "0"))
      .join(""),
    version === 4 ? 16 : 24,
    version === 4 ? 4 : 16,
    "hex"
  );
  // Options
  headerOptions?.copy(packetBuffer, 20);
  // Payload
  IPPayload.copy(packetBuffer, headerLength * 4);

  return packetBuffer;
}

export { generateFakeNetworkPacket };
