import * as pcap from "pcap";

const tcp_tracker = new pcap.TCPTracker();
const session = pcap.createSession("enp9s0");

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
  const decodedPacket = pcap.decode.packet(raw);
  // console.log("dst host", decodedPacket.payload.dhost.addr);
  // console.log("src host", decodedPacket.payload.shost.addr);
  tcp_tracker.track_packet(decodedPacket);
});
