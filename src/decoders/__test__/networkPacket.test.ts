import { decodeNetworkPacket } from "../networkPacket";
import { generateFakeEthernetFrameBuffer } from "./ethernetFrame.mock";
import { generateFakeNetworkPacket } from "./networkPacket.mock";

describe("Network packet decoder", () => {
  it("Can parse TTL on IPv4", () => {
    const ttl = 123;
    const version = 4;

    const packet = generateFakeNetworkPacket({ version, ttl });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.ttl).toEqual(ttl);
  });

  it("Can parse protocol on IPv4", () => {
    const protocol = 6;
    const version = 4;

    const packet = generateFakeNetworkPacket({
      version,
      protocol,
    });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.protocol).toEqual(protocol);
  });

  it("Can parse source IP on IPv4", () => {
    const ipSource = "192.168.1.123";
    const version = 4;

    const packet = generateFakeNetworkPacket({
      version,
      ipSource,
    });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.ipSource).toEqual(ipSource);
  });

  it("Can parse destination IP on IPv4", () => {
    const ipDestination = "192.168.1.123";
    const version = 4;

    const packet = generateFakeNetworkPacket({
      version,
      ipDestination,
    });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.ipDestination).toEqual(ipDestination);
  });

  it("Can parse options on IPv4", () => {});

  it("Can extract payload on IPv4", () => {
    const payload = "Hello, world!";
    const version = 4;

    const packet = generateFakeNetworkPacket({
      version,
      payload,
    });

    const parsed = decodeNetworkPacket(packet);

    const expected = Buffer.from(payload, "utf8");

    expect(parsed.version).toEqual(version);
    expect(parsed.payload).toEqual(expected);
  });

  it("Can parse TTL on IPv6", () => {
    const ttl = 123;
    const version = 6;

    const packet = generateFakeNetworkPacket({ version, ttl });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.ttl).toEqual(ttl);
  });

  it("Can parse protocol on IPv6", () => {
    const protocol = 6;
    const version = 6;

    const packet = generateFakeNetworkPacket({ version, protocol });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.protocol).toEqual(protocol);
  });

  it("Can parse source IP on IPv6", () => {
    const ipSource = "2001:0999:0289:0076:6cdc:3ac3:a92f:b4b6";
    const version = 6;

    const packet = generateFakeNetworkPacket({ version, ipSource });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.ipSource).toEqual(ipSource);
  });

  it("Can parse destination IP on IPv6", () => {
    const ipDestination = "2001:0999:0289:0076:6cdc:3ac3:a92f:b4b6";
    const version = 6;

    const packet = generateFakeNetworkPacket({ version, ipDestination });

    const parsed = decodeNetworkPacket(packet);

    expect(parsed.version).toEqual(version);
    expect(parsed.ipDestination).toEqual(ipDestination);
  });

  it("Can extract payload on IPv6", () => {
    const payload = "Hello, world!";
    const version = 6;

    const packet = generateFakeNetworkPacket({
      version,
      payload,
    });

    const parsed = decodeNetworkPacket(packet);

    const expected = Buffer.from(payload, "utf8");

    expect(parsed.version).toEqual(version);
    expect(parsed.payload).toEqual(expected);
  });

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
