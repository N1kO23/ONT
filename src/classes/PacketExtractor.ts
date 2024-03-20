import * as pcap from "pcap";
import { SessionError } from "../misc/errors";
import { decodeNetworkPacket } from "../decoders/networkPacket";
import { decodeEthernetPacket } from "../decoders/ethernetFrame";
import { EthernetFrame, InternetPackage } from "../misc/frameTypes";
import { PacketExtractorEvents, TCPSession } from "../misc/genericTypes";

type ExtractorOptions = {
  isTcpTrackerEnabled?: boolean;
  redactPayloads?: boolean;
};

type PacketExtractorCallback<T> = (data: T) => void;

interface EventMap {
  open: undefined;
  close: undefined;
  error: any;
  ethernetFrame: EthernetFrame;
  networkPacket: InternetPackage;
  startedTcpSession: TCPSession;
  endedTcpSession: TCPSession;
}

export default class PacketExtractor<Event extends keyof EventMap> {
  private _networkInterface: string | null = null;
  private _isTcpTrackerEnabled = false;
  private _tcpTracker?: any = null; // TODO: Add types
  private _isInitialized = false;
  private _redactPayloads = false;

  private eventListeners: {
    [K in Event]?: PacketExtractorCallback<EventMap[K]>[];
  } = {};

  constructor(networkInterface: string, opt?: ExtractorOptions) {
    this._networkInterface = networkInterface;
    opt?.isTcpTrackerEnabled &&
      (this._isTcpTrackerEnabled = opt.isTcpTrackerEnabled);
    opt?.redactPayloads && (this._redactPayloads = opt.redactPayloads);
  }

  public on<K extends Event>(
    event: K,
    listener: PacketExtractorCallback<EventMap[K]>
  ) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event]?.push(listener);
  }

  private emit<K extends Event>(event: K, data?: EventMap[K]) {
    if (this.eventListeners[event]) {
      for (const listener of this.eventListeners[event]!) {
        listener(data as EventMap[K]);
      }
    }
  }

  public monitor(): void {
    if (!this._networkInterface) {
      throw new SessionError("Network interface must be specified!");
    }
    const session = pcap.createSession(this._networkInterface);
    this.emit(PacketExtractorEvents.OPEN as EventMap[Event]);
    this._isInitialized = true;

    if (this._isTcpTrackerEnabled) {
      this._tcpTracker = new pcap.TCPTracker();
      this._tcpTracker?.on("session", (session: any) => {
        this.emit(
          PacketExtractorEvents.STARTEDTCPSESSION as EventMap[Event],
          session
        );
        session.on("end", (session: any) => {
          this.emit(
            PacketExtractorEvents.ENDEDTCPSESSION as EventMap[Event],
            session
          );
        });
      });
    }

    session.on("packet", (raw) => {
      try {
        // Extract the ethernet frame
        const frame = decodeEthernetPacket(raw.buf);
        // Extract the internet package
        const networkPackage = decodeNetworkPacket(frame.payload!);

        // Redact payloads if true
        if (this._redactPayloads) {
          frame.payload = undefined;
          networkPackage.payload = undefined;
        }

        this.emit(
          PacketExtractorEvents.ETHERNETFRAME as EventMap[Event],
          frame
        );

        this.emit(
          PacketExtractorEvents.NETWORKPACKAGE as EventMap[Event],
          networkPackage
        );

        // If tracking TCP sessions
        if (this._isTcpTrackerEnabled) {
          this._tcpTracker?.track_packet(pcap.decode(raw));
        }
      } catch (error) {
        this.emit(PacketExtractorEvents.ERROR as EventMap[Event], error);
      }
    });
  }
}
