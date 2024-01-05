import { EthernetFrame } from "../misc/frameTypes";

function decodeEthernetPacket(buf: Buffer): EthernetFrame {
  if (buf.length <= 14) {
    throw new Error("Invalid Ethernet frame");
  }

  // The offset acts as a pointer to where we are decoding from
  let offset = 0;

  const macDestination = buf
    .slice(offset, offset + 6)
    .toString("hex")
    .replace(/(.{2})(?=.)/g, "$1:");
  offset += 6;

  const macSource = buf
    .slice(offset, offset + 6)
    .toString("hex")
    .replace(/(.{2})(?=.)/g, "$1:");
  offset += 6;

  // Check if the frame contains VLAN tag
  let etherType = buf.slice(offset, offset + 2).toString("hex");
  offset += 2;
  const tagNumeric = buf.readUInt16BE(offset); // Read the VLAN tag
  const tagData = etherType === "8100" && parseVLAN(tagNumeric);
  if (tagData) {
    offset += 2;
    // Now we have gone over the VLAN tag, so we read the ethernet frame type
    etherType = buf.slice(offset, offset + 2).toString("hex");
    offset += 2;
  }

  const payload = buf.slice(offset);

  const ethernetFrame: EthernetFrame = {
    macDestination,
    macSource,
    etherType,
    payload,
  };

  if (tagData) {
    ethernetFrame.vlanTag = tagData;
  }

  return ethernetFrame;
}

// Parses the VLAN tag data from the raw byte value
function parseVLAN(buf: number) {
  const priority = (buf >> 13) & 0x7;
  const cfi = (buf >> 12) & 0x1;
  const vlanId = buf & 0xfff;

  return { priority, cfi, vlanId };
}

export { decodeEthernetPacket };
