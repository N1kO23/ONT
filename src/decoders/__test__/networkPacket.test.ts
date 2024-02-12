import { decodeNetworkPacket } from "../networkPacket";
import { generateFakeEthernetFrameBuffer } from "./ethernetFrame.mock";
import { generateFakeNetworkPacket } from "./networkPacket.mock";

describe("Network packet decoder", () => {
  it("Can parse TTL on IPv4", () => {
    const TTL = 123;

    const packet = generateFakeNetworkPacket({ version: 4, ttl: TTL });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(4);
    expect(parsed.ttl).toEqual(TTL);
  });

  it("Can parse protocol on IPv4", () => {
    const protocol = 6;

    const packet = generateFakeNetworkPacket({
      version: 4,
      protocol,
    });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(4);
    expect(parsed.protocol).toEqual(protocol);
  });

  it("Can parse source IP on IPv4", () => {
    const ipSource = "192.168.1.123";

    const packet = generateFakeNetworkPacket({
      version: 4,
      ipSource,
    });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(4);
    expect(parsed.ipSource).toEqual(ipSource);
  });

  it("Can parse destination IP on IPv4", () => {
    const ipDestination = "192.168.1.123";

    const packet = generateFakeNetworkPacket({
      version: 4,
      ipDestination,
    });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(4);
    expect(parsed.ipDestination).toEqual(ipDestination);
  });

  it("Can parse options on IPv4", () => {});

  it("Can extract payload on IPv4", () => {
    const payload = "Hello, world!";

    const packet = generateFakeNetworkPacket({
      version: 4,
      payload,
    });

    const parsed = decodeNetworkPacket(packet);

    const expected = Buffer.from(payload, "utf8");

    expect(parsed.version).toEqual(4);
    expect(parsed.payload).toEqual(expected);
  });

  it("Can parse TTL on IPv6", () => {});

  it("Can parse protocol on IPv6", () => {});

  it("Can parse source IP on IPv6", () => {});

  it("Can parse destination IP on IPv6", () => {});

  it("Can extract payload on IPv6", () => {});

  it("Throws error on if network package version is invalid", () => {
    const frame = generateFakeNetworkPacket({
      version: 0,
      ipDestination: "127.0.0.1",
      ipSource: "127.0.0.127",
    });

    expect(() => decodeNetworkPacket(frame)).toThrow(
      "Invalid Internet packet version: 0"
    );
  });
});
