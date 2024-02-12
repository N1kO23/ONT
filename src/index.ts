import * as pcap from "pcap";
import * as os from "os";
import { config } from "dotenv";

import { SessionError } from "./misc/errors";
import { decodeEthernetPacket } from "./decoders/ethernetFrame";
import { decodeNetworkPacket } from "./decoders/networkPacket";

config();

const networkInterfaces = os.networkInterfaces();

console.log(networkInterfaces);

const tcp_tracker = new pcap.TCPTracker();

// Create a new PCAP session
console.log(
  `Trying to open PCAP session to interface ${process.env.INTERFACE}...`
);
if (!process.env.INTERFACE) {
  throw new SessionError("Network interface must be specified!");
}
const session = pcap.createSession(process.env.INTERFACE); // TODO: add a fallback default interface
console.log("PCAP session opened");

tcp_tracker.on("session", (session: any) => {
  console.log(
    "Start of session between " + session.src_name + " and " + session.dst_name
  );
  session.on("end", (session: any) => {
    console.log(
      "End of TCP session between " +
        session.src_name +
        " and " +
        session.dst_name
    );
  });
});

session.on("packet", (raw) => {
  // const decodedPacket = pcap.decode.packet(raw);
  // console.log(raw);
  try {
    const frame = decodeEthernetPacket(raw.buf);
    const networkPackage = decodeNetworkPacket(frame.payload);

    // console.log(frame);
    console.log(networkPackage);
  } catch (error) {
    console.error(error);
  }

  // console.log("decoded", decodedPacket);
  // console.log("src host", decodedPacket.payload.shost.addr);
  // tcp_tracker.track_packet(decodedPacket);
});
