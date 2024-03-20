import { config } from "dotenv";
import PacketExtractor from "./classes/PacketExtractor";
import { PacketExtractorEvents } from "./misc/genericTypes";

config();

const extractor = new PacketExtractor(process.env.INTERFACE ?? "", {
  isTcpTrackerEnabled: true,
  redactPayloads: true,
});

extractor.on(PacketExtractorEvents.OPEN, () => {
  console.log("Opened session");
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
