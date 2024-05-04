import { decodeEthernetPacket } from "../ethernetFrame";
import { generateFakeEthernetFrameBuffer } from "./ethernetFrame.mock";

describe("Ethernet frame decoder", () => {
  it("Can parse source MAC address", () => {
    const sourceMACAddress = "f0:2f:74:8c:12:9d";

    const frame = generateFakeEthernetFrameBuffer({
      sourceMACAddress,
    });
    const parsed = decodeEthernetPacket(frame);

    expect(parsed.macSource).toBe(sourceMACAddress);
  });

  it("Can parse destination MAC address", () => {
    const destinationMACAddress = "f0:2f:74:8c:16:9d";

    const frame = generateFakeEthernetFrameBuffer({
      destinationMACAddress,
    });
    const parsed = decodeEthernetPacket(frame);

    expect(parsed.macDestination).toBe(destinationMACAddress);
  });

  it("Can detect that VLAN is present", () => {
    const frame = generateFakeEthernetFrameBuffer({
      ethernetType: "8100",
    });
    const parsed = decodeEthernetPacket(frame);

    expect(parsed.vlanTag).toBeTruthy();
  });

  it("Can read VLAN data", () => {
    const frame = generateFakeEthernetFrameBuffer({
      ethernetType: "8100",
      vlanData: "BD34", // 1011110100110100
    });
    const parsed = decodeEthernetPacket(frame);

    const expected = {
      priority: 5,
      cfi: 1,
      vlanId: 3380,
    };

    expect(parsed.vlanTag).toEqual(expected);
  });

  it("Can extract payload", () => {
    const payload = "Hello World!";

    const frame = generateFakeEthernetFrameBuffer({
      payload,
    });
    const parsed = decodeEthernetPacket(frame);

    const expected = Buffer.from(payload, "utf8");

    expect(parsed.payload).toEqual(expected);
  });

  it("Throws error on invalid ethernet frame", () => {
    const frame = generateFakeEthernetFrameBuffer({
      destinationMACAddress: "",
      sourceMACAddress: "",
      payload: "",
    });

    const brokenFrame = frame.slice(10);

    expect(() => decodeEthernetPacket(brokenFrame)).toThrow(
      "Invalid Ethernet frame"
    );
  });
});
