import { config } from "dotenv";
import PacketExtractor from "./classes/PacketExtractor";
import { PacketExtractorEvents } from "./misc/genericTypes";

config();

const networkInterface = process.env.INTERFACE;

if (!networkInterface)
  throw new Error('Network interface is not defined, check your .env file!');

const extractor = new PacketExtractor(networkInterface, {
  isTcpTrackerEnabled: true,
});

extractor.on(PacketExtractorEvents.OPEN, () => {
  console.log("Opened PCAP session");
});

extractor.on(PacketExtractorEvents.CLOSE, () => {
  console.log("Closed PCAP session");
});

extractor.on(PacketExtractorEvents.ETHERNETFRAME, (data) => {
  console.log(data);
});

extractor.on(PacketExtractorEvents.NETWORKPACKAGE, (data) => {
  console.log(data);
});

extractor.on(PacketExtractorEvents.STARTEDTCPSESSION, (data) => {
  console.log(data);
});

extractor.on(PacketExtractorEvents.ENDEDTCPSESSION, (data) => {
  console.log(data);
});

extractor.on(PacketExtractorEvents.ERROR, (data) => {
  console.error(data);
});

extractor.monitor();
