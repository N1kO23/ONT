export enum PacketExtractorEvents {
  OPEN = "open",
  CLOSE = "close",
  ERROR = "error",
  ETHERNETFRAME = "ethernetFrame",
  NETWORKPACKAGE = "networkPacket",
  STARTEDTCPSESSION = "startedTcpSession",
  ENDEDTCPSESSION = "endedTcpSession",
}

export type TCPSession = {
  src: string;
  src_name: string;
  dst: string;
  dst_name: string;
  state: string;
  current_cap_time: number;
  syn_time: number;
  missed_syn: boolean;
  connect_time: number;
  send_isn: number;
  send_window_scale: number;
  send_packets: unknown;
  send_acks: unknown;
  send_retrans: unknown;
  send_next_seq: number;
  send_acked_seq: unknown;
  send_bytes_ip: number;
  send_bytes_tcp: number;
  send_bytes_payload: number;
  recv_isn: unknown;
  recv_window_scale: unknown;
  recv_packets: unknown;
  recv_acks: unknown;
  recv_retrans: unknown;
  recv_next_seq: unknown;
  recv_acked_seq: unknown;
  recv_bytes_ip: number;
  recv_bytes_tcp: number;
  recv_bytes_payload: number;
};
