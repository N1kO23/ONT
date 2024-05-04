type EthernetGeneratorOptions = {
  sourceMACAddress?: string;
  destinationMACAddress?: string;
  ethernetType?: string;
  vlanData?: string;
  payload?: string;
  crc?: string;
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

function generateFakeEthernetFrameBuffer(
  options: EthernetGeneratorOptions
): Buffer {
  // Deconstruct options
  const {
    sourceMACAddress,
    destinationMACAddress,
    ethernetType,
    vlanData,
    payload,
    crc,
  } = options;

  // Generates a random MAC address and returns it
  const getRandomMACAddress = (): string => {
    const chars = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 6; i++) {
      mac += chars.charAt(Math.floor(Math.random() * chars.length));
      mac += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < 5) {
        mac += ":";
      }
    }
    return mac;
  };

  // Ethernet frame type
  const etherType = "0x" + Math.floor(Math.random() * 10000).toString(16);

  // MAC addresses
  const destinationMAC = destinationMACAddress ?? getRandomMACAddress();
  const sourceMAC = sourceMACAddress ?? getRandomMACAddress();

  // Payload envelope
  const ethernetPayload = Buffer.from(payload ?? "SamplePayload", "utf8");

  // Create random 4 bit data for 32-bit CRC
  const finalCrc = crc ?? generatePseudoRandomBytes(4);

  // Putting it all together
  const frameBuffer = Buffer.alloc(
    (vlanData ? 16 : 14) + ethernetPayload.length + 4
  );
  frameBuffer.write(destinationMAC.split(":").join(""), 0, 6, "hex");
  frameBuffer.write(sourceMAC.split(":").join(""), 6, 6, "hex");
  frameBuffer.write(ethernetType ?? etherType.substr(2), 12, 2, "hex");
  vlanData && frameBuffer.write(vlanData, 14, 2, "hex");
  ethernetPayload.copy(frameBuffer, vlanData ? 16 : 14);
  frameBuffer.write(
    finalCrc,
    frameBuffer.length - 4,
    frameBuffer.length,
    "hex"
  );

  return frameBuffer;
}

export { generateFakeEthernetFrameBuffer };
